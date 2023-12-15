// consulta.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, HttpException, HttpStatus } from '@nestjs/common';
import { ConsultaService } from 'src/services/consulta.service';
import { Consulta } from 'src/entities/consulta/consulta.entity';

@Controller('consultas')
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

  @Get()
  async getAllConsultas(): Promise<Consulta[]> {
    return this.consultaService.getAllConsultas();
  }

  @Post()
  async createConsulta(@Body() consultaData: Consulta, @Body('pacienteId') pacienteId: number): Promise<any> {
    try {
      const consultaId = await this.consultaService.createConsulta(pacienteId, consultaData);
      return { message: 'Se creo la consulta correctamente', consultaId: consultaId }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ha ocurrido un error al crear la consulta',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
  @Put(':idConsulta')
  async editarDatosConsulta(
    @Param('idConsulta', ParseIntPipe) idConsulta: number,
    @Body() datos: Partial<Consulta>,
  ) {
    const consultaActualizada = await this.consultaService.editarDatosConsulta(idConsulta, datos);
    return { consulta: consultaActualizada };
  }
}
