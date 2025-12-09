import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Repository } from 'typeorm';
import { CrearCursoDto } from './dto/create-curso.dto';

@Injectable()
export class CursosService {
  constructor(@InjectRepository(Curso) private repo: Repository<Curso>) {}

  crear(dto: CrearCursoDto) {
    const c = this.repo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      cupoMaximo: dto.cupoMaximo ?? 30,
      etiquetas: dto.etiquetas,
      profesorId: dto.profesorId,
    });
    return this.repo.save(c);
  }

  listar(filters?: any) {
    const qb = this.repo.createQueryBuilder('c');
    if (filters?.profesorId) qb.andWhere('c.profesorId = :p', { p: filters.profesorId });
    if (filters?.etiqueta) qb.andWhere('FIND_IN_SET(:etiqueta, c.etiquetas)', { etiqueta: filters.etiqueta });
    const page = Number(filters?.page || 1);
    const limit = Number(filters?.limit || 20);
    return qb.skip((page - 1) * limit).take(limit).getMany();
  }

  buscarPorId(id: number) { return this.repo.findOne({ where: { id } }); }

  actualizar(id: number, patch: Partial<Curso>) {
    return this.repo.update(id, patch).then(() => this.buscarPorId(id));
  }

  eliminar(id: number) { return this.repo.delete(id); }
}
