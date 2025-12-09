import { IsInt, IsNotEmpty } from 'class-validator';

export class CrearInscripcionDto {
  @IsInt({ message: 'El ID del curso debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del curso no debe estar vacío' })
  cursoId: number;

  @IsInt({ message: 'El ID del estudiante debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del estudiante no debe estar vacío' })
  estudianteId: number;
}