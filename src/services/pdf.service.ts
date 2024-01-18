import * as PDFKit from 'pdfkit';
import { Injectable } from '@nestjs/common';

const PDFDocument = require('pdfkit-table');

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
      const doc = new PDFDocument({ layout: 'landscape', margin: 30, size: 'A4' });
      const pdfBuffer: Buffer[] = [];

      doc.on('data', (chunk) => {
        pdfBuffer.push(chunk);
      });

      doc.on('end', () => {
        const combinedBuffer = Buffer.concat(pdfBuffer);
        resolve(combinedBuffer);
      });

      doc.on('error', (error) => {
        reject(error);
      });

      // Formatear la fecha en un formato de fácil lectura
      const fechaFormateada = fecha.toISOString().slice(0, 10);

      doc.fontSize(18).text(`Informe de Citas Médicas - ${tipo} (${fechaFormateada})\n\n`, { align: 'center' });

      const table = {
        headers: [
          'Doctor',
          'Total de Citas',
          'Consultas',
          'Reconsultas',
          'Emergencias',
          'Adultos Mayores'
        ],
        rows: Object.entries(stats.doctores).map(([doctor, doctorStats]: [string, DoctorStats]) => [
          doctor,
          doctorStats.totalCitas || 0,
          doctorStats.consultas || 0,
          doctorStats.reconsultas || 0,
          doctorStats.emergencias || 0,
          doctorStats.adultoMayor || 0,
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
        prepareRow: (row, i) => doc.font('Helvetica').fontSize(10),
      });

      doc.moveDown().moveDown();

      const totalTable = {
        headers: [
          'Total de Citas',
          'Consultas',
          'Reconsultas',
          'Emergencias',
          'Adultos Mayores'
        ],
        rows: [[
          stats.totalCitas || 0,
          stats.consultas || 0,
          stats.reconsultas || 0,
          stats.emergencias || 0,
          stats.adultoMayor || 0,
        ]],
      };

      doc.table(totalTable, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
        prepareRow: (row, i) => doc.font('Helvetica').fontSize(10),
      });

      doc.end();
    });
  }
}
