import * as PDFKit from 'pdfkit';
import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TablePdfService {
  async generatePdf(data: any[]): Promise<Buffer> {
    const pdfDoc = new PDFKit({ layout: 'landscape' });
    const pdfBuffer: Buffer[] = [];

    pdfDoc.on('data', (chunk) => {
      pdfBuffer.push(chunk);
    });

    return new Promise<Buffer>((resolve, reject) => {
      pdfDoc.on('end', () => {
        const combinedBuffer = Buffer.concat(pdfBuffer);
        resolve(combinedBuffer);
      });

      pdfDoc.on('error', (error) => {
        reject(error);
      });

      pdfDoc.fontSize(12).text('Lista de Citas por Día\n\n');
      this.drawTable(pdfDoc, {
        headers: [
          'Número de Cita',
          'Nombre del Paciente',
          'Fecha de Nacimiento',
          'Carnet o Identificador',
          'Edad',
          'Sexo',
          'Domicilio',
          'Doctor Asignado',
          'Tipo de Consulta',
          'Contacto',
          'Fecha de Cita',
        ],
        rows: data.map((cita) => [
          cita.id_cita,
          cita.Nombre,
          cita.FechaNacimiento,
          cita.Carnet,
          cita.Edad,
          cita.Sexo,
          cita.Domicilio,
          cita.doctor,
          cita.tipo_consulta,
          cita.contacto,
          cita.fecha_cita,
        ]),
      });

      pdfDoc.end();
    });
  }

  private drawTable(doc: PDFKit.PDFDocument, table: { headers: string[]; rows: any[][] }): void {
    const { headers, rows } = table;
    const columnWidths = this.calculateColumnWidths([headers, ...rows], doc);

    doc.font('Helvetica-Bold');

    for (let i = 0; i < headers.length; i++) {
      doc.text(headers[i], columnWidths[i].start, doc.y, { width: columnWidths[i].width, align: 'left' });
    }

    doc.moveDown();

    doc.font('Helvetica');

    for (const row of rows) {
      for (let i = 0; i < row.length; i++) {
        doc.text(row[i].toString(), columnWidths[i].start, doc.y, { width: columnWidths[i].width, align: 'left' });
      }
      doc.moveDown();
    }
  }

  private calculateColumnWidths(rows: any[][], doc: PDFKit.PDFDocument): { start: number; width: number }[] {
    const columnWidths: { start: number; width: number }[] = [];

    for (let i = 0; i < rows[0].length; i++) {
      const columnMaxWidth = Math.max(
        doc.widthOfString(rows[0][i].toString()),
        ...rows.slice(1).map((row) => doc.widthOfString(row[i].toString()))
      );

      columnWidths.push({ start: doc.x, width: columnMaxWidth + 10 }); // Add padding
      doc.moveUp(); // Move the cursor back up to the original position
    }

    return columnWidths;
  }
}
