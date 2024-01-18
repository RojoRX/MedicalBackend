import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from 'src/services/pdf.service';
import { CitasService } from 'src/services/citas.service';
import { TablePdfService } from 'src/services/tablePdf.service';

@Controller('informe')
export class TablePdfController {
  constructor(
    private readonly pdfService: TablePdfService,
    private readonly citasService: CitasService,
  ) {}

  @Get('/detallado/:day')
  async generarPdf(@Param('day') day: string, @Res() res: Response) {
    try {
      const citasData = await this.citasService.findByDay(day);

      // Generar el PDF en memoria directamente
      const pdfBuffer = await this.pdfService.generatePdf(citasData.data);

      // Configurar el encabezado de la respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=informe.pdf'); // 'inline' abre el PDF en el navegador

      // Enviar el archivo PDF al cliente
      res.send(pdfBuffer);
    } catch (error) {
      return {
        status: 'error',
        message: 'Error al generar el PDF',
      };
    }
  }
}
