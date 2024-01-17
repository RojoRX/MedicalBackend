// informe.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformeController } from 'src/controllers/informe.controller';
import { PdfService } from '../services/pdf.service';
import { CitasService } from '../services/citas.service';
import { Cita } from '../entities/citas/citas.entity';
import { SocketGateway } from 'src/gateways/events.gateway';
import { FechaService } from 'src/utils/birthDate';

@Module({
  imports: [TypeOrmModule.forFeature([Cita])],
  controllers: [InformeController],
  providers: [PdfService, CitasService,SocketGateway, FechaService ],
})
export class InformeModule {}
