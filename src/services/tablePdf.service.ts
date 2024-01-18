import * as PDFKit from 'pdfkit';
import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit-table');

@Injectable()
export class TablePdfService {
    async generatePdf(data: any[]): Promise<Buffer> {
        const doc = new PDFDocument({ layout: 'landscape', margin: 30, size: 'A4' });
        const pdfBuffer: Buffer[] = [];

        doc.on('data', (chunk) => {
            pdfBuffer.push(chunk);
        });

        return new Promise<Buffer>((resolve, reject) => {
            doc.on('end', () => {
                const combinedBuffer = Buffer.concat(pdfBuffer);
                resolve(combinedBuffer);
            });

            doc.on('error', (error) => {
                reject(error);
            });

            doc.fontSize(18).text('Registro de Pacientes por Dia\n\n', { align: 'center' });
            doc.moveDown();
            
            /*
            doc.text('Fecha de emisión: ' + new Date().toLocaleDateString(), { align: 'left' });
            doc.moveDown();
            doc.text('Hora de emisión: ' + new Date().toLocaleTimeString(), { align: 'left' });
      */
            const table = {
                headers: [
                    'Nª',
                    'Nombre del Paciente',
                    //'Fecha de Nacimiento',
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
                    //cita.FechaNacimiento,
                    cita.Carnet,
                    cita.Edad,
                    cita.Sexo,
                    cita.Domicilio,
                    cita.doctor,
                    cita.tipo_consulta,
                    cita.contacto,
                    cita.fecha_cita,
                ]),
            };

            doc.table(table, {
                prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
                prepareRow: (row, i) => doc.font('Helvetica').fontSize(10),
            });

            doc.moveDown().moveDown();

            /*
              doc.fontSize(12).text('Este documento es válido para cualquier procedimiento legal.', { align: 'left' });
              */

            doc.end();
        });
    }
}
