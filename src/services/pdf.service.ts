import * as PDFDocument from 'pdfkit';
import { Injectable } from '@nestjs/common';

type DoctorStats = {
  totalCitas?: number;
  consultas?: number;
  reconsultas?: number;
  emergencias?: number;
  adultoMayor?: number;
};

type StatsData = {
  totalCitas?: number;
  consultas?: number;
  reconsultas?: number;
  emergencias?: number;
  adultoMayor?: number;
  doctores?: Record<string, DoctorStats>;
}; 

@Injectable()
export class PdfService {
  async generarInformeDiario(statsDiario: StatsData, fecha: Date): Promise<Buffer> {
    return this.generarInforme(statsDiario, 'Diario', fecha);
  }

  async generarInformeMensual(statsMensual: StatsData, fecha: Date): Promise<Buffer> {
    return this.generarInforme(statsMensual, 'Mensual', fecha);
  }

  private async generarInforme(stats: StatsData, tipo: string, fecha: Date): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const buffers: any[] = [];
      const doc = new PDFDocument();

      // Registro de buffers para construir el PDF
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        console.log(`Informe ${tipo} PDF generado con éxito.`);
        resolve(pdfBuffer);
      });
      doc.on('error', (error) => reject(error));

      // Encabezado del informe
      doc.fontSize(20).font('Helvetica-Bold').text(`Informe de Citas Médicas - ${tipo}`, { align: 'center' });
      doc.moveDown().lineTo(500, 20).stroke('#000');

      // Información general
      doc.moveDown().fontSize(14).font('Helvetica-Bold').text(`Estadísticas ${tipo}`, { underline: true });
      doc.fontSize(12).font('Helvetica').text(`Fecha: ${(fecha)}`);
      doc.text(`Total de Citas: ${stats.totalCitas || 0}`);

      // Estadísticas por doctor
      if (stats.doctores) {
        doc.moveDown().fontSize(14).font('Helvetica-Bold').text('Estadísticas por Doctor', { underline: true });

        Object.entries(stats.doctores).forEach(([doctor, doctorStats]: [string, DoctorStats]) => {
          doc.moveDown().fontSize(12).font('Helvetica').text(`Estadísticas para ${doctor}`, { underline: true });
          doc.text(`Total de Citas: ${doctorStats.totalCitas || 0}`);
          doc.text(`Consultas: ${doctorStats.consultas || 0}`);
          doc.text(`Reconsultas: ${doctorStats.reconsultas || 0}`);
          doc.text(`Emergencias: ${doctorStats.emergencias || 0}`);
          doc.text(`Adultos Mayores: ${doctorStats.adultoMayor || 0}`);
        });
      }

      // Finalizar y generar el PDF
      doc.end();
    });
  }

}
