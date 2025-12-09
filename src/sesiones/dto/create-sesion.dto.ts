import {
  IsInt,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearSesionDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  titulo?: string;

  @IsInt({ message: 'El ID del curso debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del curso no debe estar vacío' })
  cursoId: number;

  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida' })
  inicioAt: Date;

  @Type(() => Date)
  @IsDate({ message: 'La fecha de fin debe ser una fecha válida' })
  finAt: Date;
}
