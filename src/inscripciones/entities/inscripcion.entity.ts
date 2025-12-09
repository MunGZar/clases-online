import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique, OneToMany } from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Asistencia } from '../../asistencias/entities/asistencia.entity';
import { Participacion } from '../../participaciones/entities/participacion.entity';

@Entity('inscripciones')
@Unique(['cursoId','estudianteId'])
export class Inscripcion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: false })
  aprobada: boolean;

  @Column({ nullable: true })
  estado: string;

  @ManyToOne(() => Usuario, (u) => u.inscripciones, { onDelete: 'CASCADE' })
  estudiante: Usuario;

  @Column()
  estudianteId: number;

  @ManyToOne(() => Curso, (c) => c.inscripciones, { onDelete: 'CASCADE' })
  curso: Curso;

  @Column()
  cursoId: number;

  @CreateDateColumn()
  matriculadoEn: Date;

  @OneToMany(() => Asistencia, (a) => a.inscripciones)
  asistencias: Asistencia[];

  @OneToMany(() => Participacion, (p) => p.inscripciones)
  participaciones: Participacion[];
}
