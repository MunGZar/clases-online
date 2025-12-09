import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';
import { Inscripcion} from '../../inscripciones/entities/inscripcion.entity';

export type RolUsuario = 'estudiante' | 'profesor' | 'admin';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 120 })
  nombre: string;

  @Column({ length: 160, unique: true })
  correo: string;

  @Column({ select: false })
  clave: string;

  @Column({ type: 'enum', enum: ['estudiante','profesor','admin'], default: 'estudiante' })
  rol: RolUsuario;

  @CreateDateColumn()
  creadoEn: Date;

  @OneToMany(() => Curso, (curso) => curso.profesor)
  cursosDirigidos: Curso[];

@OneToMany(() => Inscripcion, (inscripciones) => inscripciones.estudiante)
inscripciones: Inscripcion[];
}
