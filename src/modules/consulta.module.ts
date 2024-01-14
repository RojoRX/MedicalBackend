// consulta.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from 'src/entities/consulta/consulta.entity';
import { ConsultaController } from 'src/controllers/consulta.controller';
import { ConsultaService } from 'src/services/consulta.service';
import { Paciente } from 'src/entities/pacientes/paciente.entity';
import { ConsultaAllDataService } from 'src/proc_alm/insert-all-data-consultation.service';
import { ConsultaAllDataController } from 'src/proc_alm/insert-all-data-consultation.controller';
import { Cita } from 'src/entities/citas/citas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta, Paciente,Cita])],
  controllers: [ConsultaController, ConsultaAllDataController],
  providers: [ConsultaService, ConsultaAllDataService],
})
export class ConsultaModule {}
