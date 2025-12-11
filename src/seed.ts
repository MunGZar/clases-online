import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsuariosService } from './usuarios/usuario.service'; // Corrected import
import { CrearUsuarioDto } from './usuarios/dto/create-user.dto'; // Corrected import

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usuarioService = app.get(UsuariosService);

    const usuarios = [
        {
            nombre: 'Profesor Test',
            correo: 'profesor@test.com', // Changed email to correo
            clave: '123456', // Changed password to clave
            rol: 'profesor',
        },
        {
            nombre: 'Estudiante Test',
            correo: 'estudiante@test.com',
            clave: '123456',
            rol: 'estudiante',
        },
        {
            nombre: 'Admin Test',
            correo: 'admin@test.com',
            clave: '123456',
            rol: 'admin',
        },
    ];

    for (const u of usuarios) {
        const existe = await usuarioService.buscarPorCorreo(u.correo); // Corrected method
        if (!existe) {
            await usuarioService.crear(u as CrearUsuarioDto);
            console.log(`✅ Usuario creado: ${u.correo} / 123456`);
        } else {
            console.log(`ℹ️ Usuario ya existe: ${u.correo}`);
        }
    }

    await app.close();
}

bootstrap();
