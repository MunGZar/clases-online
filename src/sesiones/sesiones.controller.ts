import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SesionesService } from './sesiones.service';
import { CrearSesionDto } from './dto/create-sesion.dto';
import { QuerySesionesDto } from './dto/query-sesiones.dto';
import { IsNotEmpty, IsInt } from 'class-validator';

// DTO para el cuerpo de las acciones de iniciar/finalizar, para mayor claridad
class ActorBodyDto {
  @IsInt()
  @IsNotEmpty()
  actorId: number;
}

@Controller('sesiones')
export class SesionesController {
  constructor(private svc: SesionesService) {}

  @Post()
  crear(@Body() dto: CrearSesionDto) {
    return this.svc.crear(dto);
  }

  @Get()
  listar(@Query() query: QuerySesionesDto) {
    return this.svc.listar(query);
  }

  @Get(':id')
  uno(@Param('id', ParseIntPipe) id: number) {
    return this.svc.buscarPorId(id);
  }

  @Patch(':id/iniciar')
  iniciar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ActorBodyDto,
  ) {
    return this.svc.iniciarSesion(id, body.actorId);
  }

  @Patch(':id/finalizar')
  finalizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ActorBodyDto,
  ) {
    return this.svc.finalizarSesion(id, body.actorId);
  }
}
