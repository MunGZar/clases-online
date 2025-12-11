import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sesion, EstadoSesion } from './entities/sesion.entity';
import { Repository, DataSource } from 'typeorm';
import { CrearSesionDto } from './dto/create-sesion.dto';
import { QuerySesionesDto } from './dto/query-sesiones.dto';
import { Curso } from '../cursos/entities/curso.entity';
import { SessionGateway } from './session.gateway';

@Injectable()
export class SesionesService {
  constructor(
    @InjectRepository(Sesion) private repo: Repository<Sesion>,
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    private dataSource: DataSource,
    @Inject(forwardRef(() => SessionGateway))
    private sessionGateway: SessionGateway,
  ) { }

  async crear(dto: CrearSesionDto) {
    if (dto.finAt <= dto.inicioAt) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }
    const curso = await this.cursoRepo.findOne({ where: { id: dto.cursoId } });
    if (!curso) {
      throw new NotFoundException(
        `El curso con id ${dto.cursoId} no fue encontrado`,
      );
    }

    const sesion = this.repo.create(dto);
    return this.repo.save(sesion);
  }

  async listar(query: QuerySesionesDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('sesion');

    if (query.cursoId) {
      qb.andWhere('sesion.cursoId = :cursoId', { cursoId: query.cursoId });
    }
    if (query.fechaDesde) {
      qb.andWhere('sesion.inicioAt >= :fechaDesde', {
        fechaDesde: query.fechaDesde,
      });
    }
    if (query.fechaHasta) {
      qb.andWhere('sesion.inicioAt <= :fechaHasta', {
        fechaHasta: query.fechaHasta,
      });
    }

    qb.leftJoinAndSelect('sesion.curso', 'curso');
    qb.orderBy('sesion.inicioAt', 'ASC');
    qb.skip(offset).take(limit);

    const [sesiones, total] = await qb.getManyAndCount();

    return {
      data: sesiones,
      total,
      page,
      limit,
    };
  }

  async buscarPorId(id: number) {
    const sesion = await this.repo.findOne({
      where: { id },
      relations: ['curso'],
    });
    if (!sesion) {
      throw new NotFoundException(`La sesión con id ${id} no fue encontrada`);
    }
    return sesion;
  }

  async iniciarSesion(sesionId: number, actorId: number, margenMinutos = 5) {
    const sesion = await this.buscarPorId(sesionId);

    if (sesion.curso.profesorId !== actorId) {
      throw new ForbiddenException(
        'Solo el profesor del curso puede iniciar la sesión',
      );
    }
    if (sesion.estado !== EstadoSesion.PROGRAMADA) {
      throw new BadRequestException(
        `No se puede iniciar una sesión que no esté en estado 'PROGRAMADA'. Estado actual: ${sesion.estado}`,
      );
    }

    const ahora = new Date();
    const inicioPermitido = new Date(sesion.inicioAt);
    inicioPermitido.setMinutes(inicioPermitido.getMinutes() - margenMinutos);

    if (ahora < inicioPermitido) {
      throw new BadRequestException(
        `La sesión no puede ser iniciada hasta ${margenMinutos} minutos antes de la hora programada.`,
      );
    }

    if (ahora > sesion.finAt) {
      throw new BadRequestException(
        'No se puede iniciar una sesión que ya ha pasado su hora de finalización.',
      );
    }

    sesion.estado = EstadoSesion.EN_VIVO;
    const resultado = await this.repo.save(sesion);

    // Emitir evento WebSocket de sesión iniciada
    this.sessionGateway.emitSessionStarted(sesionId);

    return resultado;
  }

  async finalizarSesion(sesionId: number, actorId: number) {
    const sesion = await this.buscarPorId(sesionId);

    if (sesion.curso.profesorId !== actorId) {
      throw new ForbiddenException(
        'Solo el profesor del curso puede finalizar la sesión',
      );
    }
    if (
      sesion.estado === EstadoSesion.FINALIZADA ||
      sesion.estado === EstadoSesion.CANCELADA
    ) {
      throw new BadRequestException(
        `No se puede finalizar una sesión que ya está en estado '${sesion.estado}'`,
      );
    }
    if (sesion.estado !== EstadoSesion.EN_VIVO) {
      throw new BadRequestException(
        `Solo se puede finalizar una sesión que está 'EN_VIVO'.`,
      );
    }

    sesion.estado = EstadoSesion.FINALIZADA;
    sesion.finAt = new Date();
    const resultado = await this.repo.save(sesion);

    // Emitir evento WebSocket de sesión finalizada
    this.sessionGateway.emitSessionEnded(sesionId);

    return resultado;
  }
}
