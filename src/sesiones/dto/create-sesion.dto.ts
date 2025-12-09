import { IsInt, IsDateString, IsOptional, IsString } from 'class-validator';

export class CrearSesionDto {
  @IsOptional() @IsString() titulo?: string;
  @IsInt() cursoId: number;
  @IsDateString() inicioAt: string;
  @IsDateString() finAt: string;
}
