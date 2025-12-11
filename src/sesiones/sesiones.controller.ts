import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SesionesService } from './sesiones.service';
import { CrearSesionDto } from './dto/create-sesion.dto';
import { QuerySesionesDto } from './dto/query-sesiones.dto';
import { IsNotEmpty, IsInt } from 'class-validator';

// AUTH IMPORTS
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// DTO para iniciar/finalizar sesión
class ActorBodyDto {
  @IsInt()    
  @IsNotEmpty()
  actorId: number;
}

@Controller('sesiones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SesionesController {
  constructor(private svc: SesionesService) {}

  // SOLO PROFESOR CREA SESIONES
  @Post()
  @Roles('profesor')
  crear(@Body() dto: CrearSesionDto) {
    return this.svc.crear(dto);
  }

  // PROFESOR y ESTUDIANTE pueden listar sesiones
  @Get()
  @Roles('profesor', 'estudiante')
  listar(@Query() query: QuerySesionesDto) {
    return this.svc.listar(query);
  }

  // PROFESOR y ESTUDIANTE pueden ver una sesión
  @Get(':id')
  @Roles('profesor', 'estudiante')
  uno(@Param('id', ParseIntPipe) id: number) {
    return this.svc.buscarPorId(id);
  }

  // SOLO PROFESOR INICIA LA SESIÓN
  @Patch(':id/iniciar')
  @Roles('profesor')
  iniciar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ActorBodyDto,
  ) {
    return this.svc.iniciarSesion(id, body.actorId);
  }

  // SOLO PROFESOR FINALIZA LA SESIÓN
  @Patch(':id/finalizar')
  @Roles('profesor')
  finalizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ActorBodyDto,
  ) {
    return this.svc.finalizarSesion(id, body.actorId);
  }
}
