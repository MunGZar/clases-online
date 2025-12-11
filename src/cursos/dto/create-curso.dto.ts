import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearCursoDto {
  @ApiProperty({
    description: 'Título del curso',
    example: 'Programación Avanzada en Python',
    maxLength: 200,
  })
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título no debe estar vacío' })
  @MaxLength(200, { message: 'El título no debe exceder los 200 caracteres' })
  titulo: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del curso',
    example: 'Curso completo de Python con enfoque en APIs y bases de datos',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Cupo máximo de estudiantes',
    example: 30,
    minimum: 1,
    default: 30,
  })
  @IsInt({ message: 'El cupo máximo debe ser un número entero' })
  @Min(1, { message: 'El cupo máximo debe ser de al menos 1' })
  @IsOptional()
  cupoMaximo?: number;

  @ApiPropertyOptional({
    description: 'Etiquetas/tags del curso para búsqueda y categorización',
    example: ['python', 'backend', 'api'],
    type: [String],
  })
  @IsArray({ message: 'Las etiquetas deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser un texto' })
  @IsOptional()
  etiquetas?: string[];

  @ApiProperty({
    description: 'ID del profesor que crea el curso',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID del profesor debe ser un número' })
  @IsNotEmpty({ message: 'El ID del profesor no debe estar vacío' })
  profesorId: number;
}
