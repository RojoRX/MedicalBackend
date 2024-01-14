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

  // ...
}
