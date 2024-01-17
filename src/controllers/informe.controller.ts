// informe.controller.ts
import { Controller, Get, Query, Res, StreamableFile } from "@nestjs/common";
import { PdfService } from "src/services/pdf.service";
import { CitasService } from "src/services/citas.service";
import { Readable } from "stream";

import { Response } from "express";

@Controller('informe')
export class InformeController {
  constructor(
    private readonly citasService: CitasService,
    private readonly pdfService: PdfService,
  ) {}

  @Get('mensual')
  async generarInformeMensualPDF(@Query('fecha') fecha: string, @Res() response: Response): Promise<void> {
    const fechaObj = fecha ? new Date(fecha) : new Date();

    try {
      const stats = await this.citasService.getCitasPorMes(fechaObj);
      const pdfBuffer = await this.pdfService.generarInformeMensual(stats.porMes, fechaObj);
      this.enviarRespuestaPDF(response, pdfBuffer, fechaObj, 'mensual');
    } catch (error) {
      this.handleErrorResponse(response, error, 'Error generando informe mensual en PDF');
    }
  }

  @Get('diario')
  async generarInformeDiarioPDF(@Query('fecha') fecha: string, @Res() response: Response): Promise<void> {
    const fechaObj = fecha ? new Date(fecha) : new Date();

    try {
      console.log(fechaObj)
      const stats = await this.citasService.getCitasPorDia(fechaObj);
      const pdfBuffer = await this.pdfService.generarInformeDiario(stats.porDia, fechaObj);

      this.enviarRespuestaPDF(response, pdfBuffer, fechaObj, 'diario');
    } catch (error) {
      this.handleErrorResponse(response, error, 'Error generando informe diario en PDF');
    }
  }


  private enviarRespuestaPDF(response: Response, pdfBuffer: Buffer, fechaObj: Date, tipoInforme: 'diario' | 'mensual'): void {
    const fileName = `informe_${tipoInforme}_${fechaObj.toISOString()}.pdf`;

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    response.setHeader('Content-Length', pdfBuffer.length);

    response.send(pdfBuffer);
  }

  private handleErrorResponse(response: Response, error: Error, message: string): void {
    console.error(message, error);
    response.status(500).json({ message: 'Internal Server Error', error: message });
  }
}