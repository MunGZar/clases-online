import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CrearParticipacionDto {
  @IsInt()
  @IsNotEmpty()
  idSesion: number; // ID de la sesión donde participa el estudiante

  @IsInt()
  @IsNotEmpty()
  idEstudiante: number; // ID del estudiante que participa

  @IsString()
  @IsOptional()
  tipoParticipacion?: string; // Ej: "pregunta", "respuesta", "intervención"

  @IsString()
  @IsOptional()
  comentario?: string; // Notas adicionales
}

export class ActualizarParticipacionDto {
  @IsString()
  @IsOptional()
  tipoParticipacion?: string;

  @IsString()
  @IsOptional()
  comentario?: string;
}
