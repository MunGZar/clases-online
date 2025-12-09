import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Sesion } from '../../sesiones/entities/sesion.entity';
import { Inscripcion} from '../../inscripciones/entities/inscripcion.entity';

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
