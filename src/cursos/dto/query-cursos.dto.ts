import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CursoEstado } from '../entities/curso.entity';

export class QueryCursosDto {
  @ApiPropertyOptional({
    description: 'Número de página para paginación',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de resultados por página',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID del profesor',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  profesorId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por etiqueta/tag del curso',
    example: 'python',
  })
  @IsOptional()
  @IsString()
  etiqueta?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado del curso',
    example: 'ACTIVO',
    enum: CursoEstado,
  })
  @IsOptional()
  @IsIn(Object.values(CursoEstado))
  estado?: CursoEstado;
}
