import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { Repository, DataSource } from 'typeorm';
import { Curso } from '../cursos/entities/curso.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CrearInscripcionDto } from './dto/crear-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { QueryInscripcionesDto } from './dto/query-inscripciones.dto';

// 👉 IMPORTANTE: importar Sesion correctamente
import { Sesion } from '../sesiones/entities/sesion.entity';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion) private repo: Repository<Inscripcion>,
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    private dataSource: DataSource,
  ) { }

  async crear(dto: CrearInscripcionDto) {
    const { cursoId, estudianteId } = dto;

    return this.dataSource.transaction(async (manager) => {
      const curso = await manager
        .getRepository(Curso)
        .createQueryBuilder('c')
        .where('c.id = :id', { id: cursoId })
        .getOne();

      if (!curso) {
        throw new NotFoundException(
          `El curso con id ${cursoId} no fue encontrado`,
        );
      }

      const estudiante = await manager
        .getRepository(Usuario)
        .findOne({ where: { id: estudianteId } });

      if (!estudiante) {
        throw new NotFoundException(
          `El estudiante con id ${estudianteId} no fue encontrado`,
        );
      }

      const inscripcionExistente = await manager
        .getRepository(Inscripcion)
        .findOne({ where: { cursoId, estudianteId } });

      if (inscripcionExistente) {
        throw new ConflictException(
          'El estudiante ya está inscrito en este curso',
        );
      }

      // Revisar cupo máximo
      const inscripcionesActuales = await manager.getRepository(Inscripcion).count({
        where: { cursoId, aprobada: true },
      });

      if (curso.cupoMaximo && inscripcionesActuales >= curso.cupoMaximo) {
        throw new ConflictException(
          `El cupo máximo del curso (${curso.cupoMaximo}) ha sido alcanzado`,
        );
      }

      const inscripcion = manager.getRepository(Inscripcion).create({
        curso,
        estudiante,
        aprobada: false,
        estado: 'PENDIENTE',
      });
      try {
        return await manager.getRepository(Inscripcion).save(inscripcion);
      } catch (e) {
        console.error('❌ ERROR AL GUARDAR INSCRIPCION:', e);
        throw e;
      }
    });
  }

  async listar(query: QueryInscripcionesDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('inscripcion');

    if (query.cursoId) {
      qb.andWhere('inscripcion.cursoId = :cursoId', { cursoId: query.cursoId });
    }
    if (query.estudianteId) {
      qb.andWhere('inscripcion.estudianteId = :estudianteId', {
        estudianteId: query.estudianteId,
      });
    }
    if (typeof query.aprobada === 'boolean') {
      qb.andWhere('inscripcion.aprobada = :aprobada', {
        aprobada: query.aprobada,
      });
    }
    if (query.estado) {
      qb.andWhere('inscripcion.estado = :estado', { estado: query.estado });
    }

    qb.leftJoinAndSelect('inscripcion.curso', 'curso');
    qb.leftJoinAndSelect('inscripcion.estudiante', 'estudiante');
    qb.orderBy('inscripcion.matriculadoEn', 'DESC');
    qb.skip(offset).take(limit);

    const [inscripciones, total] = await qb.getManyAndCount();

    return {
      data: inscripciones,
      total,
      page,
      limit,
    };
  }

  async buscarPorId(id: number) {
    const inscripcion = await this.repo.findOne({
      where: { id },
      relations: ['curso', 'estudiante'],
    });
    if (!inscripcion) {
      throw new NotFoundException(
        `La inscripción con id ${id} no fue encontrada`,
      );
    }
    return inscripcion;
  }

  async listarPorCurso(cursoId: number) {
    const curso = await this.cursoRepo.findOne({ where: { id: cursoId } });
    if (!curso) {
      throw new NotFoundException(`El curso con id ${cursoId} no fue encontrado`);
    }
    return this.repo.find({
      where: { cursoId },
      relations: ['estudiante', 'curso'],
    });
  }

  async actualizar(id: number, dto: UpdateInscripcionDto) {
    const inscripcion = await this.repo.preload({
      id,
      ...dto,
    });
    if (!inscripcion) {
      throw new NotFoundException(
        `La inscripción con id ${id} no fue encontrada`,
      );
    }
    return this.repo.save(inscripcion);
  }

  async aprobar(id: number) {
    const inscripcion = await this.buscarPorId(id);
    if (inscripcion.aprobada) {
      throw new BadRequestException('La inscripción ya ha sido aprobada');
    }
    inscripcion.aprobada = true;
    inscripcion.estado = 'APROBADA';
    return this.repo.save(inscripcion);
  }

  async eliminar(id: number) {
    const inscripcion = await this.buscarPorId(id);
    await this.repo.remove(inscripcion);
    return { message: `Inscripción con id ${id} eliminada correctamente` };
  }

  //  MÉTODO COMPLETO Y CORRECTO PARA EL AUDIT MIDDLEWARE
  async verificarInscripcion(estudianteId: number, sessionId: number): Promise<boolean> {
    // 1️⃣ Buscar la sesión real en tu sistema
    const sesion = await this.dataSource.getRepository(Sesion).findOne({
      where: { id: sessionId },
      relations: ['curso'],
    });

    if (!sesion) return false;

    const cursoId = sesion.cursoId;

    //  Verificar si el usuario está inscrito correctamente y aprobado
    const inscripcion = await this.repo.findOne({
      where: { estudianteId, cursoId, aprobada: true },
    });

    return !!inscripcion;
  }
}
