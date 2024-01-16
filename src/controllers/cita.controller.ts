import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Cita } from "src/entities/citas/citas.entity";
import { CitasService } from "src/services/citas.service";

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Get()
  findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }
  // Encontrar una cita
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.citasService.findOne(id);
  }
   // Crear una nueva cita
   @Post()
   async create(@Body() cita: Cita): Promise<Cita> {
     return this.citasService.create(cita);
   }
 
   // Actualizar una cita
   @Put(':id')
   async update(@Param('id') id: number, @Body() cita: Cita): Promise<Cita> {
     return this.citasService.update(id, cita);
   }
 
   // Borrar una cita
   @Delete(':id')
   async delete(@Param('id') id: number): Promise<void> {
     return this.citasService.delete(id);
   }
  // Ruta para actualizar el campo enEspera de una cita
  @Put(':id/en-espera')
  async updateEnEspera(@Param('id') id: number): Promise<any> {
    return this.citasService.updateEnEspera(id);
  }
  // ...
  @Get('by-day/:day')
  async getCitasByDay(@Param('day') day: string) {
    try {
      const result = await this.citasService.findByDay(day);

      if (result.status === 'success') {
        return { status: 'success', data: result.data };
      } else {
        return { status: 'error', message: result.message };
      }
    } catch (error) {
      return { status: 'error', message: 'Internal server error' };
    }
  }
  @Get("report/:date")
  getCitasPorDia(@Param("date") date: string) {
    const fecha = new Date(`${date}T00:00:00`);
    return this.citasService.getCitasPorDiaYMes(fecha);
  }
}
