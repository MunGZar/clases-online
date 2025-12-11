import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index, JoinColumn } from 'typeorm';
import { Sesion } from '../../sesiones/entities/sesion.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('asistencias')
@Index(['sesionId', 'estudianteId'])
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

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estudianteId' })
  estudiante: Usuario;

  @Column()
  estudianteId: number;

  @CreateDateColumn()
  creadoEn: Date;
}
