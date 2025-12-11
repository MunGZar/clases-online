import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El email debe tener un formato válido.' })
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(32, { message: 'La contraseña no puede tener más de 32 caracteres.' })
  password: string;
}
