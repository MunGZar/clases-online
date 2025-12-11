import {
  IsInt,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearSesionDto {
  @ApiPropertyOptional({
    description: 'Título de la sesión',
    example: 'Clase 1: Introducción a Python',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  titulo?: string;

  @ApiProperty({
    description: 'ID del curso al que pertenece esta sesión',
    example: 1,
  })
  @IsInt({ message: 'El ID del curso debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del curso no debe estar vacío' })
  cursoId: number;

  @ApiProperty({
    description: 'Fecha y hora de inicio de la sesión (formato: YYYY-MM-DD HH:mm:ss)',
    example: '2025-12-15 10:00:00',
    type: String,
  })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida' })
  inicioAt: Date;

  @ApiProperty({
    description: 'Fecha y hora de fin de la sesión (formato: YYYY-MM-DD HH:mm:ss)',
    example: '2025-12-15 12:00:00',
    type: String,
  })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de fin debe ser una fecha válida' })
  finAt: Date;
}
