import { IsInt, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoParticipacion } from '../entities/participacion.entity';

export class CrearParticipacionDto {
  @ApiProperty({
    description: 'ID de la sesión donde participa el estudiante',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  sesionId: number;

  @ApiProperty({
    description: 'ID del estudiante que participa',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  estudianteId: number;

  @ApiProperty({
    description: 'Tipo de participación',
    example: 'pregunta',
    enum: TipoParticipacion,
  })
  @IsEnum(TipoParticipacion)
  @IsNotEmpty()
  tipo: TipoParticipacion;

  @ApiProperty({
    description: 'Contenido de la participación (mensaje, pregunta, etc.)',
    example: '¿Cómo funciona el decorador @property?',
  })
  @IsString()
  @IsNotEmpty()
  contenido: string;
}

export class ActualizarParticipacionDto {
  @ApiPropertyOptional({
    description: 'Tipo de participación',
    example: 'pregunta',
    enum: TipoParticipacion,
  })
  @IsEnum(TipoParticipacion)
  @IsOptional()
  tipo?: TipoParticipacion;

  @ApiPropertyOptional({
    description: 'Contenido de la participación',
    example: 'Texto actualizado',
  })
  @IsString()
  @IsOptional()
  contenido?: string;
}
