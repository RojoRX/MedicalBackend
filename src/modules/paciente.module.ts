// paciente.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from 'src/entities/pacientes/paciente.entity';
import { PacienteController } from 'src/controllers/paciente.controller';
import { PacienteService } from 'src/services/paciente.service';
import { SocketGateway } from 'src/gateways/events.gateway';
import { FechaService } from 'src/utils/birthDate';
import { Cita } from 'src/entities/citas/citas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, Cita])],
  controllers: [PacienteController],
  providers: [PacienteService,SocketGateway, FechaService],
})
export class PacienteModule {}
