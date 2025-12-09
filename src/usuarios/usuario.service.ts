import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { CrearUsuarioDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario) private repo: Repository<Usuario>) {}

  async crear(dto: CrearUsuarioDto) {
    const hash = await bcrypt.hash(dto.clave, 10);
    const u = this.repo.create({ nombre: dto.nombre, correo: dto.correo, clave: hash, rol: dto.rol || 'estudiante' });
    return this.repo.save(u);
  }

  listar() { return this.repo.find(); }
  buscarPorId(id: number) { return this.repo.findOne({ where: { id } }); }
  buscarPorCorreo(correo: string, withClave = false) {
    if (withClave) {
      return this.repo.createQueryBuilder('u').addSelect('u.clave').where('u.correo = :correo', { correo }).getOne();
    }
    return this.repo.findOne({ where: { correo }});
  }
  eliminar(id: number) { return this.repo.delete(id); }
}
