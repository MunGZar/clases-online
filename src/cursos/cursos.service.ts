import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Repository } from 'typeorm';
import { CrearCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { QueryCursosDto } from './dto/query-cursos.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso) private repo: Repository<Curso>,
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
  ) {}

  async crear(dto: CrearCursoDto) {
    await this.checkProfesor(dto.profesorId);
    const curso = this.repo.create(dto);
    return this.repo.save(curso);
  }

  async listar(query: QueryCursosDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('curso');

    if (query.profesorId) {
      qb.andWhere('curso.profesorId = :profesorId', {
        profesorId: query.profesorId,
      });
    }

    if (query.estado) {
      qb.andWhere('curso.estado = :estado', { estado: query.estado });
    }

    if (query.etiqueta) {
      // THIS IS A WEAK SEARCH, but ok for simple-array.
      // For a more robust search, a many-to-many relation with a Tag entity would be better.
      qb.andWhere('curso.etiquetas LIKE :etiqueta', {
        etiqueta: `%${query.etiqueta}%`,
      });
    }

    qb.leftJoinAndSelect('curso.profesor', 'profesor');
    qb.orderBy('curso.creadoEn', 'DESC');
    qb.skip(offset).take(limit);

    const [cursos, total] = await qb.getManyAndCount();
    return {
      data: cursos,
      total,
      page,
      limit,
    };
  }

  async buscarPorId(id: number) {
    const curso = await this.repo.findOne({
      where: { id },
      relations: ['profesor', 'sesiones'],
    });
    if (!curso) {
      throw new NotFoundException(`El curso con id ${id} no fue encontrado`);
    }
    return curso;
  }

  async actualizar(id: number, dto: UpdateCursoDto) {
    if (dto.profesorId) {
      await this.checkProfesor(dto.profesorId);
    }
    // preload carga la entidad y aplica los cambios del DTO.
    const curso = await this.repo.preload({
      id,
      ...dto,
    });
    if (!curso) {
      throw new NotFoundException(`El curso con id ${id} no fue encontrado`);
    }
    return this.repo.save(curso);
  }

  async eliminar(id: number) {
    const curso = await this.buscarPorId(id); // Re-usa la lógica para encontrar o fallar.
    await this.repo.remove(curso);
    return { message: `Curso con id ${id} eliminado correctamente` };
  }

  private async checkProfesor(profesorId: number) {
    const profesor = await this.usuarioRepo.findOne({ where: { id: profesorId } });
    if (!profesor) {
      throw new NotFoundException(
        `El profesor con id ${profesorId} no fue encontrado`,
      );
    }
  }
}
