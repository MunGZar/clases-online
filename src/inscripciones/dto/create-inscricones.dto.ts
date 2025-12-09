import { IsInt } from 'class-validator';
export class CrearMatriculaDto {
  @IsInt() cursoId: number;
  @IsInt() estudianteId: number;
}
