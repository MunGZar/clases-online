import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique, OneToMany, JoinColumn } from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';


@Entity('inscripciones')
@Unique(['cursoId', 'estudianteId'])
export class Inscripcion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: false })
  aprobada: boolean;

  @Column({ nullable: true })
  estado: string;

  @ManyToOne(() => Usuario, (u) => u.inscripciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estudianteId' })
  estudiante: Usuario;

  @Column({ nullable: true })
  estudianteId: number;

  @ManyToOne(() => Curso, (c) => c.inscripciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cursoId' })
  curso: Curso;

  @Column({ nullable: true })
  cursoId: number;

  @CreateDateColumn()
  matriculadoEn: Date;

}
