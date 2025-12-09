import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Asistencia } from './entities/asistencia.entity';

@Injectable()
export class AsistenciasService {
  constructor(@InjectRepository(Asistencia) private repo: Repository<Asistencia>) {}

  async marcarConectado(sesionId: number, estudianteId: number) {
    let a = await this.repo.findOne({ where: { sesionId, estudianteId }});
    const ahora = new Date();
    if (!a) {
      a = this.repo.create({ sesionId, estudianteId, conectadoEn: ahora });
      return this.repo.save(a);
    }
    if (!a.conectadoEn) { a.conectadoEn = ahora; return this.repo.save(a); }
    return a;
  }

  async marcarDesconectado(sesionId: number, estudianteId: number) {
    const a = await this.repo.findOne({ where: { sesionId, estudianteId }});
    if (!a) throw new NotFoundException();
    const ahora = new Date();
    a.desconectadoEn = ahora;
    if (a.conectadoEn) a.duracionSeg = Math.max(0, Math.floor((ahora.getTime() - a.conectadoEn.getTime())/1000));
    return this.repo.save(a);
  }

  async evaluarPresencia(sesionId: number, estudianteId: number, umbralMin = 10) {
    const a = await this.repo.findOne({ where: { sesionId, estudianteId }});
    if (!a) throw new NotFoundException();
    if ((a.duracionSeg ?? 0) >= umbralMin * 60) { a.presente = true; return this.repo.save(a); }
    return a;
  }

  listarPorSesion(sesionId: number) { return this.repo.find({ where: { sesionId } }); }
}
