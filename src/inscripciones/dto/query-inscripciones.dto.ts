import { IsOptional, IsInt, Min, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryInscripcionesDto {
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
  cursoId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  estudianteId?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  aprobada?: boolean;

  @IsOptional()
  @IsIn(['PENDIENTE', 'APROBADA', 'RECHAZADA']) // Assuming these are valid states for 'estado'
  estado?: string;
}
