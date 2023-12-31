// paciente.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from 'src/entities/pacientes/paciente.entity';
import { PacienteController } from 'src/controllers/paciente.controller';
import { PacienteService } from 'src/services/paciente.service';
import { SocketGateway } from 'src/gateways/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente])],
  controllers: [PacienteController],
  providers: [PacienteService,SocketGateway],
})
export class PacienteModule {}
