import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Sesion, EstadoSesion } from './entities/sesion.entity';
import { AsistenciasService } from '../asistencias/asistencias.service';
import { ParticipacionesService } from '../participaciones/participaciones.service';
import { TipoParticipacion } from '../participaciones/entities/participacion.entity';

interface AuthenticatedSocket extends Socket {
    userId?: number;
    userRole?: string;
}

interface ConnectedUser {
    userId: number;
    socketId: string;
    joinedAt: Date;
}

@WebSocketGateway({
    cors: {
        origin: [
            'https://frontend-estudiantes.com',
            'https://frontend-profesores.com',
            'http://localhost:3000',
            'http://localhost:4200',
        ],
        credentials: true,
    },
})
export class SessionGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(SessionGateway.name);

    // Mapa de usuarios conectados por sesión: sessionId -> ConnectedUser[]
    private connectedUsers: Map<number, ConnectedUser[]> = new Map();

    constructor(
        private jwtService: JwtService,
        @InjectRepository(Inscripcion)
        private inscripcionRepo: Repository<Inscripcion>,
        @InjectRepository(Sesion)
        private sesionRepo: Repository<Sesion>,
        private asistenciasService: AsistenciasService,
        private participacionesService: ParticipacionesService,
    ) { }

    /**
     * Maneja la conexión de un cliente WebSocket
     * Valida el token JWT en el handshake
     */
    async handleConnection(client: AuthenticatedSocket) {
        try {
            const token = this.extractTokenFromHandshake(client);
            if (!token) {
                this.logger.warn(`Cliente sin token intentó conectarse: ${client.id}`);
                client.disconnect();
                return;
            }

            const payload = await this.jwtService.verifyAsync(token);
            client.userId = payload.sub;
            client.userRole = payload.rol;

            this.logger.log(
                `Cliente conectado: ${client.id} | Usuario: ${client.userId} | Rol: ${client.userRole}`,
            );
        } catch (error) {
            this.logger.error(`Error en autenticación WebSocket: ${error.message}`);
            client.disconnect();
        }
    }

    /**
     * Maneja la desconexión de un cliente
     * Marca la desconexión en asistencias
     */
    async handleDisconnect(client: AuthenticatedSocket) {
        this.logger.log(`Cliente desconectado: ${client.id}`);

        // Buscar en qué sesión estaba el usuario y removerlo
        for (const [sessionId, users] of this.connectedUsers.entries()) {
            const userIndex = users.findIndex((u) => u.socketId === client.id);
            if (userIndex !== -1) {
                const user = users[userIndex];
                users.splice(userIndex, 1);

                // Marcar desconexión en asistencias
                if (client.userId) {
                    try {
                        await this.asistenciasService.marcarDesconectado(
                            sessionId,
                            client.userId,
                        );

                        // Evaluar si cumple con el umbral de asistencia (10 minutos)
                        await this.asistenciasService.evaluarPresencia(
                            sessionId,
                            client.userId,
                            10,
                        );
                    } catch (error) {
                        this.logger.error(
                            `Error al marcar desconexión: ${error.message}`,
                        );
                    }
                }

                // Emitir evento de salida
                this.server.to(`session_${sessionId}`).emit('user.left_session', {
                    userId: client.userId,
                    sessionId,
                    timestamp: new Date(),
                    connectedCount: users.length,
                });

                break;
            }
        }
    }

    /**
     * Evento: Usuario se une a una sesión
     */
    @SubscribeMessage('join_session')
    async handleJoinSession(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() data: { sessionId: number },
    ) {
        try {
            const { sessionId } = data;
            const userId = client.userId;

            if (!userId) {
                throw new UnauthorizedException('Usuario no autenticado');
            }

            // Verificar que la sesión existe y está en vivo
            const sesion = await this.sesionRepo.findOne({
                where: { id: sessionId },
                relations: ['curso'],
            });

            if (!sesion) {
                client.emit('error', { message: 'Sesión no encontrada' });
                return;
            }

            // Verificar que el usuario está inscrito en el curso (si es estudiante)
            if (client.userRole === 'estudiante') {
                const inscripcion = await this.inscripcionRepo.findOne({
                    where: { cursoId: sesion.cursoId, estudianteId: userId },
                });

                if (!inscripcion) {
                    client.emit('error', {
                        message: 'No estás inscrito en este curso',
                    });
                    this.logger.warn(
                        `Intento de acceso no autorizado: Usuario ${userId} no inscrito en curso ${sesion.cursoId}`,
                    );
                    return;
                }
            }

            // Unir al cliente a la sala de la sesión
            client.join(`session_${sessionId}`);

            // Registrar usuario conectado
            if (!this.connectedUsers.has(sessionId)) {
                this.connectedUsers.set(sessionId, []);
            }
            const users = this.connectedUsers.get(sessionId)!;
            users.push({
                userId,
                socketId: client.id,
                joinedAt: new Date(),
            });

            // Marcar conexión en asistencias (solo para estudiantes)
            if (client.userRole === 'estudiante') {
                await this.asistenciasService.marcarConectado(sessionId, userId);
            }

            // Emitir evento a todos en la sala
            this.server.to(`session_${sessionId}`).emit('user.joined_session', {
                userId,
                sessionId,
                timestamp: new Date(),
                connectedCount: users.length,
            });

            this.logger.log(
                `Usuario ${userId} se unió a sesión ${sessionId}. Conectados: ${users.length}`,
            );

            // Enviar confirmación al cliente
            client.emit('joined_successfully', {
                sessionId,
                connectedCount: users.length,
            });
        } catch (error) {
            this.logger.error(`Error en user.joined_session: ${error.message}`);
            client.emit('error', { message: error.message });
        }
    }

    /**
     * Evento: Mensaje de chat enviado
     */
    @SubscribeMessage('send_message')
    async handleChatMessage(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() data: { sessionId: number; message: string },
    ) {
        try {
            const { sessionId, message } = data;
            const userId = client.userId;

            if (!userId) {
                throw new UnauthorizedException('Usuario no autenticado');
            }

            // Registrar participación
            await this.participacionesService.crear({
                sesionId: sessionId,
                estudianteId: userId,
                tipo: TipoParticipacion.MENSAJE,
                contenido: message,
            });

            // Emitir mensaje a todos en la sala
            this.server.to(`session_${sessionId}`).emit('chat.message_sent', {
                userId,
                sessionId,
                message,
                timestamp: new Date(),
            });

            this.logger.log(
                `Mensaje de chat en sesión ${sessionId} por usuario ${userId}`,
            );
        } catch (error) {
            this.logger.error(`Error en chat.message_sent: ${error.message}`);
            client.emit('error', { message: error.message });
        }
    }

    /**
     * Evento: Pregunta realizada
     */
    @SubscribeMessage('ask_question')
    async handleQuestion(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() data: { sessionId: number; question: string },
    ) {
        try {
            const { sessionId, question } = data;
            const userId = client.userId;

            if (!userId) {
                throw new UnauthorizedException('Usuario no autenticado');
            }

            // Registrar participación como pregunta
            await this.participacionesService.crear({
                sesionId: sessionId,
                estudianteId: userId,
                tipo: TipoParticipacion.PREGUNTA,
                contenido: question,
            });

            // Emitir pregunta a todos en la sala
            this.server.to(`session_${sessionId}`).emit('question.asked', {
                userId,
                sessionId,
                question,
                timestamp: new Date(),
            });

            this.logger.log(
                `Pregunta en sesión ${sessionId} por usuario ${userId}`,
            );
        } catch (error) {
            this.logger.error(`Error en question.asked: ${error.message}`);
            client.emit('error', { message: error.message });
        }
    }

    /**
     * Evento: Profesor inicia la sesión
     * Este método es llamado desde el servicio de sesiones
     */
    emitSessionStarted(sessionId: number) {
        this.server.to(`session_${sessionId}`).emit('session.started', {
            sessionId,
            timestamp: new Date(),
        });
        this.logger.log(`Sesión ${sessionId} iniciada - evento emitido`);
    }

    /**
     * Evento: Profesor finaliza la sesión
     * Este método es llamado desde el servicio de sesiones
     */
    emitSessionEnded(sessionId: number) {
        this.server.to(`session_${sessionId}`).emit('session.ended', {
            sessionId,
            timestamp: new Date(),
        });
        this.logger.log(`Sesión ${sessionId} finalizada - evento emitido`);

        // Limpiar usuarios conectados
        this.connectedUsers.delete(sessionId);
    }

    /**
     * Obtener contador de usuarios conectados en una sesión
     */
    getConnectedUsersCount(sessionId: number): number {
        return this.connectedUsers.get(sessionId)?.length || 0;
    }

    /**
     * Extrae el token JWT del handshake
     */
    private extractTokenFromHandshake(client: Socket): string | null {
        const token =
            client.handshake.auth?.token ||
            client.handshake.headers?.authorization?.split(' ')[1];
        return token || null;
    }
}
