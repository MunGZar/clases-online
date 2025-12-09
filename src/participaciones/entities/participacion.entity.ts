import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Sesion } from '../../sesiones/entities/sesion.entity';
import { Inscripcion} from '../../inscripciones/entities/inscripcion.entity';

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
  sesion: Sesion;

  @Column()
  sesionId: number;

  @ManyToOne(() => Inscripcion, (m) => m.participaciones, { onDelete: 'SET NULL' })
  inscripciones: Inscripcion;

  @Column({ nullable: true })
  estudianteId: number;

  @Column({ type: 'enum', enum: TipoParticipacion })
  tipo: TipoParticipacion;

  @Column({ type: 'text' })
  contenido: string;

  @CreateDateColumn()
  creadoEn: Date;
}
