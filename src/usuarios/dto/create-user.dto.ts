import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CrearUsuarioDto {
  @IsString() nombre: string;
  @IsEmail() correo: string;
  @IsString() @MinLength(6) clave: string;
  @IsOptional() @IsEnum(['estudiante','profesor','admin']) rol?: 'estudiante' | 'profesor' | 'admin';
}
