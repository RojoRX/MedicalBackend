import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CitasController } from "src/controllers/cita.controller";
import { ConsultaController } from "src/controllers/consulta.controller";
import { Cita } from "src/entities/citas/citas.entity";
import { Consulta } from "src/entities/consulta/consulta.entity";
import { Paciente } from "src/entities/pacientes/paciente.entity";
import { SocketGateway } from "src/gateways/events.gateway";
import { CitasService } from "src/services/citas.service";
import { ConsultaService } from "src/services/consulta.service";
import { FechaService } from "src/utils/birthDate";

@Module({
    imports: [TypeOrmModule.forFeature([Cita, Consulta, Paciente])],
    controllers: [CitasController, ConsultaController],
    providers: [CitasService, ConsultaService, SocketGateway, FechaService],
  })
  export class CitasModule {}
  