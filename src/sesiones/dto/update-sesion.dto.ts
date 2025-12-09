import { PartialType } from '@nestjs/mapped-types';
import { CrearSesionDto } from './create-sesion.dto';

export class UpdateSesionDto extends PartialType(CrearSesionDto) {}
