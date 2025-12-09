import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Participacion, TipoParticipacion } from './participacion.entity/participacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticipacionesService {
  constructor(@InjectRepository(Participacion) private repo: Repository<Participacion>) {}

  crear(dto: Partial<Participacion>) {
    const p = this.repo.create(dto as any);
    return this.repo.save(p);
  }

  listarPorSesion(sesionId: number) { return this.repo.find({ where: { sesionId } }); }
}
