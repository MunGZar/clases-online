import { PartialType } from '@nestjs/mapped-types';
import { CrearCursoDto } from './create-curso.dto';

export class UpdateCursoDto extends PartialType(CrearCursoDto) {}
