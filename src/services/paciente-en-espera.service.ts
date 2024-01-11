import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEnEspera } from 'src/entities/pacienteEnEspera/pacienteEspera.entity';
import { FechaService } from 'src/utils/birthDate';

@Injectable()
export class PacienteEnEsperaService {
  constructor(
    @InjectRepository(PacienteEnEspera)
    private readonly pacienteEnEsperaRepository: Repository<PacienteEnEspera>,
    private fechaService: FechaService, // Inyecta FechaService aquí
  ) {}

  async getPacientesEnEspera(): Promise<PacienteEnEspera[]> {
    // Obtener pacientes ordenados por timestampLlegada de forma descendente
    const pacientes = await this.pacienteEnEsperaRepository.find({
      order: { timestampLlegada: 'ASC' },
    });

    // Formatear el campo timestampLlegada a solo la hora y calcular la edad
    pacientes.forEach((paciente) => {
      if (paciente.timestampLlegada instanceof Date) {
        paciente.horaLlegada = paciente.timestampLlegada.toLocaleTimeString();
      }
      if (paciente.FechaNacimiento) {
        const fechaNacimiento = new Date(paciente.FechaNacimiento);
        paciente.Edad = this.fechaService.convertirFechaNacimiento(fechaNacimiento); // Usa el método aquí
      }
    });

    return pacientes;
  }
}
