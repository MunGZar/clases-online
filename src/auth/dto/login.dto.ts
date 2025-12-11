import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'profesor@test.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'El email debe tener un formato válido.' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @IsString({ message: 'La contraseña debe ser un texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(32, { message: 'La contraseña no puede tener más de 32 caracteres.' })
  password: string;
}
