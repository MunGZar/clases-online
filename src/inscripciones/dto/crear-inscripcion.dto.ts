import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearInscripcionDto {
  @ApiProperty({
    description: 'ID del curso al que se desea inscribir',
    example: 1,
  })
  @IsInt({ message: 'El ID del curso debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del curso no debe estar vacío' })
  cursoId: number;

  @ApiProperty({
    description: 'ID del estudiante que se inscribe',
    example: 2,
  })
  @IsInt({ message: 'El ID del estudiante debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del estudiante no debe estar vacío' })
  estudianteId: number;
}