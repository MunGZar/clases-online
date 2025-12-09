import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Sesion } from '../../sesiones/sesion.entity/sesion.entity';
import { Inscripcion} from '../../inscripciones/inscripcion.entity/inscripcion.entity';

@Entity('asistencias')
@Index(['sesionId','estudianteId'])
export class Asistencia {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'datetime', nullable: true })
  conectadoEn: Date | null;

  @Column({ type: 'datetime', nullable: true })
  desconectadoEn: Date | null;

  @Column({ type: 'int', default: 0 })
  duracionSeg: number;

  @Column({ default: false })
  presente: boolean;

  @ManyToOne(() => Sesion, (s) => s.asistencias, { onDelete: 'CASCADE' })
  sesion: Sesion;

  @Column()
  sesionId: number;

  @ManyToOne(() => Inscripcion, (m) => m.asistencias, { onDelete: 'CASCADE' })
  inscripciones: Inscripcion;

  @Column()
  estudianteId: number;

  @CreateDateColumn()
  creadoEn: Date;
}
