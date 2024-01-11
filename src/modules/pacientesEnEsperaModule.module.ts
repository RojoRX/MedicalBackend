import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEnEsperaController } from 'src/controllers/paciente-en-espera.controller';
import { PacienteEnEspera } from 'src/entities/pacienteEnEspera/pacienteEspera.entity';
import { PacienteEnEsperaService } from 'src/services/paciente-en-espera.service';
import { FechaService } from 'src/utils/birthDate';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteEnEspera])],
  providers: [PacienteEnEsperaService, FechaService],
  controllers: [PacienteEnEsperaController],
})
export class PacientesEnEsperaModule {}
