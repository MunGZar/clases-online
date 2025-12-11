import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { Sesion, EstadoSesion } from '../sesiones/entities/sesion.entity';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectRepository(Asistencia) private repo: Repository<Asistencia>,
    @InjectRepository(Sesion) private sesionRepo: Repository<Sesion>,
  ) { }

  /**
   * Verifica si la sesión está finalizada
   * Bloquea operaciones de asistencia en sesiones finalizadas
   */
  private async verificarSesionFinalizada(sesionId: number): Promise<void> {
    const sesion = await this.sesionRepo.findOne({ where: { id: sesionId } });
    if (!sesion) {
      throw new NotFoundException(`Sesión ${sesionId} no encontrada`);
    }
    if (sesion.estado === EstadoSesion.FINALIZADA || sesion.estado === EstadoSesion.CANCELADA) {
      throw new BadRequestException(
        'No se puede marcar asistencia en una sesión finalizada o cancelada',
      );
    }
  }

  async marcarConectado(sesionId: number, estudianteId: number) {
    // Verificar que la sesión no esté finalizada
    await this.verificarSesionFinalizada(sesionId);

    let a = await this.repo.findOne({ where: { sesionId, estudianteId } });
    const ahora = new Date();
    if (!a) {
      a = this.repo.create({ sesionId, estudianteId, conectadoEn: ahora });
      return this.repo.save(a).catch(err => {
        console.error('❌ Error al guardar asistencia (create):', err);
        throw err;
      });
    }
    if (!a.conectadoEn) {
      a.conectadoEn = ahora;
      return this.repo.save(a).catch(err => {
        console.error('❌ Error al actualizar asistencia:', err);
        throw err;
      });
    }
    return a;
  }

  async marcarDesconectado(sesionId: number, estudianteId: number) {
    const a = await this.repo.findOne({ where: { sesionId, estudianteId } });
    if (!a) throw new NotFoundException();
    const ahora = new Date();
    a.desconectadoEn = ahora;
    if (a.conectadoEn) a.duracionSeg = Math.max(0, Math.floor((ahora.getTime() - a.conectadoEn.getTime()) / 1000));
    return this.repo.save(a);
  }

  /**
   * Evalúa si el estudiante cumple con el umbral de presencia
   * @param sesionId ID de la sesión
   * @param estudianteId ID del estudiante
   * @param umbralMin Umbral en minutos (por defecto 10)
   */
  async evaluarPresencia(sesionId: number, estudianteId: number, umbralMin = 10) {
    const a = await this.repo.findOne({ where: { sesionId, estudianteId } });
    if (!a) throw new NotFoundException();
    if ((a.duracionSeg ?? 0) >= umbralMin * 60) {
      a.presente = true;
      return this.repo.save(a);
    }
    return a;
  }

  listarPorSesion(sesionId: number) { return this.repo.find({ where: { sesionId } }); }
}
