import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion} from './inscripcion.entity/inscripcion.entity';
import { Repository, DataSource } from 'typeorm';
import { Curso } from '../cursos/curso.entity/curso.entity';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion) private repo: Repository<Inscripcion>,
    private dataSource: DataSource,
  ) {}

  async matricular(cursoId: number, estudianteId: number) {
    return this.dataSource.transaction(async manager => {
      const curso = await manager.getRepository(Curso)
        .createQueryBuilder('c')
        .setLock('pessimistic_write')
        .where('c.id = :id', { id: cursoId })
        .getOne();

      if (!curso) throw new NotFoundException('Curso no encontrado');

      const count = await manager.getRepository(Inscripcion).count({ where: { cursoId, aprobada: true }});
      const capacidad = curso.cupoMaximo ?? 0;
      if (capacidad > 0 && count >= capacidad) {
        throw new ConflictException('Cupo del curso completo');
      }

      const existe = await manager.getRepository(Inscripcion).findOne({ where: { cursoId, estudianteId }});
      if (existe) return existe;

      const m = manager.getRepository(Inscripcion).create({
        cursoId,
        estudianteId,
        aprobada: false,
      });
      return manager.getRepository(Inscripcion).save(m);
    });
  }

  listarPorCurso(cursoId: number) { return this.repo.find({ where: { cursoId } }); }
  aprobar(id: number) { return this.repo.update(id, { aprobada: true }); }
}
