import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, Index } from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';
import { Asistencia } from '../../asistencias/entities/asistencia.entity';
import { Participacion } from '../../participaciones/entities/participacion.entity';

export enum EstadoSesion {
  PROGRAMADA = 'programada',
  EN_VIVO = 'en_vivo',
  FINALIZADA = 'finalizada',
  CANCELADA = 'cancelada',
}

@Entity('sesiones')
export class Sesion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 200, nullable: true })
  titulo: string;

  @ManyToOne(() => Curso, (c) => c.sesiones, { onDelete: 'CASCADE' })
  curso: Curso;

  @Column()
  cursoId: number;

  @Column({ type: 'datetime' })
  inicioAt: Date;

  @Column({ type: 'datetime' })
  finAt: Date;

  @Column({ type: 'enum', enum: EstadoSesion, default: EstadoSesion.PROGRAMADA })
  @Index()
  estado: EstadoSesion;

  @CreateDateColumn()
  creadoEn: Date;

  @OneToMany(() => Asistencia, (a) => a.sesion)
  asistencias: Asistencia[];

  @OneToMany(() => Participacion, (p) => p.sesion)
  participaciones: Participacion[];
}
