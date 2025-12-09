import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sesion, EstadoSesion } from './entities/sesion.entity';
import { Repository, DataSource } from 'typeorm';
import { CrearSesionDto } from './dto/create-sesion.dto';
import { CursosService } from '../cursos/cursos.service';

@Injectable()
export class SesionesService {
  constructor(
    @InjectRepository(Sesion) private repo: Repository<Sesion>,
    private cursosSvc: CursosService,
    private dataSource: DataSource,
  ) {}

  async crear(dto: CrearSesionDto) {
    const curso = await this.cursosSvc.buscarPorId(dto.cursoId);
    if (!curso) throw new NotFoundException('Curso no encontrado');
    const s = this.repo.create({
      titulo: dto.titulo,
      cursoId: dto.cursoId,
      inicioAt: new Date(dto.inicioAt),
      finAt: new Date(dto.finAt),
      estado: EstadoSesion.PROGRAMADA,
    });
    return this.repo.save(s);
  }

  listar(filters?: any) {
    const qb = this.repo.createQueryBuilder('s');
    if (filters?.cursoId) qb.andWhere('s.cursoId = :c', { c: filters.cursoId });
    if (filters?.fechaDesde) qb.andWhere('s.inicioAt >= :fd', { fd: filters.fechaDesde });
    if (filters?.fechaHasta) qb.andWhere('s.inicioAt <= :fh', { fh: filters.fechaHasta });
    const page = Number(filters?.page || 1);
    const limit = Number(filters?.limit || 20);
    return qb.skip((page - 1) * limit).take(limit).getMany();
  }

  buscarPorId(id: number) { return this.repo.findOne({ where: { id } }); }

  async iniciarSesion(sesionId: number, actorId: number, margenMinutos = 5) {
    return this.dataSource.transaction(async manager => {
      const s = await manager.getRepository(Sesion).findOne({ where: { id: sesionId }});
      if (!s) throw new NotFoundException('Sesión no encontrada');
      const curso = await this.cursosSvc.buscarPorId(s.cursoId);
      if (!curso) throw new NotFoundException('Curso no encontrado');
      if (curso.profesorId !== actorId) throw new ForbiddenException('Solo el profesor puede iniciar');
      const ahora = new Date();
      const earliest = new Date(s.inicioAt);
      earliest.setMinutes(earliest.getMinutes() - margenMinutos);
      if (ahora < earliest) throw new BadRequestException('Demasiado pronto para iniciar');
      s.estado = EstadoSesion.EN_VIVO;
      return manager.getRepository(Sesion).save(s);
    });
  }

  async finalizarSesion(sesionId: number, actorId: number) {
    const s = await this.buscarPorId(sesionId);
    if (!s) throw new NotFoundException('Sesión no encontrada');
    const curso = await this.cursosSvc.buscarPorId(s.cursoId);
    if (!curso) throw new NotFoundException('Curso no encontrado');
    if (curso.profesorId !== actorId) throw new ForbiddenException('Solo el profesor puede finalizar');
    s.estado = EstadoSesion.FINALIZADA;
    return this.repo.save(s);
  }
}
