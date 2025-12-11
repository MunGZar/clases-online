import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Sesion } from '../../sesiones/entities/sesion.entity';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum TipoParticipacion {
  PREGUNTA = 'pregunta',
  MENSAJE = 'mensaje',
  OTRO = 'otro',
}

@Entity('participaciones')
export class Participacion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Sesion, (s) => s.participaciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sesionId' })
  sesion: Sesion;

  @Column()
  sesionId: number;

  @ManyToOne(() => Usuario, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'estudianteId' })
  estudiante: Usuario;

  @Column({ nullable: true })
  estudianteId: number;

  @Column({ type: 'enum', enum: TipoParticipacion })
  tipo: TipoParticipacion;

  @Column({ type: 'text' })
  contenido: string;

  @CreateDateColumn()
  creadoEn: Date;
}
