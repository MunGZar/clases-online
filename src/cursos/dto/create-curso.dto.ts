import { IsNotEmpty, IsOptional, IsInt, Min, IsArray } from 'class-validator';

export class CrearCursoDto {
  @IsNotEmpty() titulo: string;
  @IsOptional() descripcion?: string;
  @IsOptional() @IsInt() @Min(0) cupoMaximo?: number;
  @IsOptional() @IsArray() etiquetas?: string[];
  @IsOptional() profesorId?: number;
}
