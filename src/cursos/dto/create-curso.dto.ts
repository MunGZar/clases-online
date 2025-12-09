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

export class CrearCursoDto {
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título no debe estar vacío' })
  @MaxLength(200, { message: 'El título no debe exceder los 200 caracteres' })
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt({ message: 'El cupo máximo debe ser un número entero' })
  @Min(1, { message: 'El cupo máximo debe ser de al menos 1' })
  @IsOptional()
  cupoMaximo?: number;

  @IsArray({ message: 'Las etiquetas deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser un texto' })
  @IsOptional()
  etiquetas?: string[];

  @IsNumber({}, { message: 'El ID del profesor debe ser un número' })
  @IsNotEmpty({ message: 'El ID del profesor no debe estar vacío' })
  profesorId: number;
}
