import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { AntecedentesPersonalesService } from 'src/services/antecedentes-personales.service';
import { AntecedentesPersonales } from 'src/entities/antecedentes/antecedentes-personales.entity';

@Controller('antecedentes-personales')
export class AntecedentesPersonalesController {
  constructor(private antecedentesService: AntecedentesPersonalesService) {}

  @Get(':pacienteId')
  async getAntecedentesByPacienteId(@Param('pacienteId', ParseIntPipe) pacienteId: number): Promise<AntecedentesPersonales[]> {
    return this.antecedentesService.getAntecedentesByPacienteId(pacienteId);
  }

  @Post(':pacienteId')
  async createAntecedente(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
    @Body() antecedenteData: AntecedentesPersonales,
  ): Promise<AntecedentesPersonales> {
    return this.antecedentesService.createAntecedente(pacienteId, antecedenteData);
  }

  @Put(':idAntecedente')
  async updateAntecedente(
    @Param('idAntecedente', ParseIntPipe) idAntecedente: number,
    @Body() antecedenteData: AntecedentesPersonales,
  ): Promise<AntecedentesPersonales> {
    return this.antecedentesService.updateAntecedente(idAntecedente, antecedenteData);
  }

  @Delete(':idAntecedente')
  async deleteAntecedente(@Param('idAntecedente', ParseIntPipe) idAntecedente: number): Promise<void> {
    return this.antecedentesService.deleteAntecedente(idAntecedente);
  }
}
