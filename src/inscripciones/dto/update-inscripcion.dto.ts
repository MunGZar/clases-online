import { PartialType } from '@nestjs/mapped-types';
import { CrearInscripcionDto } from './crear-inscripcion.dto';
import { IsOptional, IsBoolean, IsIn } from 'class-validator';

export class UpdateInscripcionDto extends PartialType(CrearInscripcionDto) {
  @IsOptional()
  @IsBoolean()
  aprobada?: boolean;

  @IsOptional()
  @IsIn(['PENDIENTE', 'APROBADA', 'RECHAZADA']) // Assuming these are valid states for 'estado'
  estado?: string;
}
