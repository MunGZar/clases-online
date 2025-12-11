import { IsOptional, IsInt, Min, IsDate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SesionEstado {
  PROGRAMADA = 'PROGRAMADA',
  EN_VIVO = 'EN_VIVO',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA',
}

export class QuerySesionesDto {
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
    description: 'Filtrar por ID del curso',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cursoId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por estado de la sesión',
    example: 'PROGRAMADA',
    enum: SesionEstado,
  })
  @IsOptional()
  @IsIn(Object.values(SesionEstado))
  estado?: SesionEstado;

  @ApiPropertyOptional({
    description: 'Filtrar sesiones desde esta fecha (formato: YYYY-MM-DD HH:mm:ss)',
    example: '2025-12-01 00:00:00',
    type: String,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaDesde?: Date;

  @ApiPropertyOptional({
    description: 'Filtrar sesiones hasta esta fecha (formato: YYYY-MM-DD HH:mm:ss)',
    example: '2025-12-31 23:59:59',
    type: String,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaHasta?: Date;
}
