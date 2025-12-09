import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { CursoEstado } from '../entities/curso.entity';

export class QueryCursosDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  profesorId?: number;

  @IsOptional()
  @IsString()
  etiqueta?: string;

  @IsOptional()
  @IsIn(Object.values(CursoEstado))
  estado?: CursoEstado;
}
