import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Usuario } from '../../usuarios/usuario.entity/usuario.entity';
import { Sesion } from '../../sesiones/sesion.entity/sesion.entity';
import { Inscripcion} from '../../inscripciones/inscripcion.entity/inscripcion.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @ManyToOne(() => Usuario, (u) => u.cursosDirigidos, { onDelete: 'SET NULL' })
  profesor: Usuario;

  @Column({ nullable: true })
  profesorId: number;

  @Column({ type: 'int', default: 30 })
  cupoMaximo: number;

  @Column({ type: 'simple-array', nullable: true })
  etiquetas: string[];

  @CreateDateColumn()
  creadoEn: Date;

  @OneToMany(() => Sesion, (s) => s.curso)
  sesiones: Sesion[];

  @OneToMany(() => Inscripcion, (m) => m.curso)
  inscripciones: Inscripcion[];
}
