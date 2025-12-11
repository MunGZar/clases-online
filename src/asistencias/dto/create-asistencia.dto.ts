import { IsInt, IsOptional, IsBoolean, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConectarSesionDto {
  @ApiProperty({
    description: 'ID de la sesión a la que se conecta el estudiante',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  sesionId: number;
}

export class DesconectarSesionDto {
  @ApiProperty({
    description: 'ID de la sesión de la que se desconecta el estudiante',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  sesionId: number;
}

export class EvaluarPresenciaDto {
  @ApiProperty({
    description: 'ID de la sesión donde evaluar la presencia',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  sesionId: number;

  @ApiProperty({
    description: 'ID del estudiante a evaluar',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  estudianteId: number;

  @ApiPropertyOptional({
    description: 'Umbral mínimo de minutos conectado para marcar asistencia (default: 10)',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  umbralMin?: number;
}

export class UpdateAttendanceDto {
  @ApiPropertyOptional({
    description: 'ID de la sesión',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  sessionId?: number;

  @ApiPropertyOptional({
    description: 'ID del estudiante',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  studentId?: number;

  @ApiPropertyOptional({
    description: 'Marcar si el estudiante estuvo presente',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  present?: boolean;
}
