// informe.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformeController } from 'src/controllers/informe.controller';
import { PdfService } from '../services/pdf.service';
import { CitasService } from '../services/citas.service';
import { Cita } from '../entities/citas/citas.entity';
import { SocketGateway } from 'src/gateways/events.gateway';
import { FechaService } from 'src/utils/birthDate';
import { TablePdfController } from 'src/controllers/tablePdf.controller';
import { TablePdfService } from 'src/services/tablePdf.service';



@Module({
  imports: [TypeOrmModule.forFeature([Cita])],
  controllers: [InformeController, TablePdfController],
  providers: [PdfService, CitasService,SocketGateway, FechaService, TablePdfService ],
})
export class InformeModule {}
