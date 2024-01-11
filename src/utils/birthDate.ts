import { Injectable } from '@nestjs/common';

@Injectable()
export class FechaService {
  convertirFechaNacimiento(fechaNacimiento: Date): string {
    const fechaActual = new Date();
    const diferencia = fechaActual.getTime() - fechaNacimiento.getTime();
    const anos = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365));
    const meses = Math.floor((diferencia - anos * (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));

    if (anos > 0) {
      return `${anos} año${anos === 1 ? '' : 's'}`;
    } else if (meses > 0) {
      return `${meses} mes${meses === 1 ? '' : 'es'}`;
    } else {
      return 'Menos de un mes';
    }
  }
}
