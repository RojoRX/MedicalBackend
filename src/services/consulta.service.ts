// consulta.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consulta } from 'src/entities/consulta/consulta.entity';
import { Paciente } from 'src/entities/pacientes/paciente.entity';
import { Cita } from 'src/entities/citas/citas.entity';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta)
    private readonly consultaRepository: Repository<Consulta>,
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {}

  async getAllConsultas(): Promise<Consulta[]> {
    return this.consultaRepository.find();
  }

  async createConsulta(pacienteId: number, motivoConsulta: string, nombreDoctor: string, idCita: number): Promise<number> {
    const paciente = await this.pacienteRepository.findOne({ where: { ID_Paciente: pacienteId } });
    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }
  
    const nuevaConsulta = new Consulta();
    nuevaConsulta.Motivo_Consulta = motivoConsulta;
    nuevaConsulta.Nombre_Doctor = nombreDoctor;
    nuevaConsulta.paciente = paciente;
  
    // Asigna la cita si se proporciona
    if (idCita) {
      const cita = await this.citaRepository.findOne({ where: { id_cita: idCita } });
  
      if (!cita) {
        throw new Error('Cita no encontrada');
      }
  
      nuevaConsulta.cita = cita;
    }
  
    const consultaGuardada = await this.consultaRepository.save(nuevaConsulta);
  
    // Retorna el ID de la consulta creada
    return consultaGuardada.ID_Consulta;
  }
  


  async editarDatosConsulta(idConsulta: number, datos: Partial<Consulta>): Promise<Consulta> {
    const consultaExistente = await this.consultaRepository.findOne({
      where: { ID_Consulta: idConsulta },
    });

    if (!consultaExistente) {
      throw new NotFoundException(`Consulta con ID ${idConsulta} no encontrada`);
    }

    await this.consultaRepository.update(idConsulta, datos);

    // Obtener la consulta actualizada después de la actualización
    const consultaActualizada = await this.consultaRepository.findOne({
      where: { ID_Consulta: idConsulta },
    });

    if (!consultaActualizada) {
      throw new NotFoundException(`Consulta con ID ${idConsulta} no encontrada después de la actualización`);
    }

    return consultaActualizada;
  }
}