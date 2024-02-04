// paciente.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from 'src/entities/pacientes/paciente.entity';
import { PacienteDuplicadoException } from 'src/exceptions/paciente-duplicado.exception';
import { SocketGateway } from 'src/gateways/events.gateway';
import { FechaService } from 'src/utils/birthDate';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
    private socketGateway: SocketGateway,
    private fechaService: FechaService, 
  ) { }


  async crearPaciente(datosPaciente: any): Promise<Paciente> {
    try {
      if (datosPaciente) {
        // Convertir los campos a mayúsculas
        datosPaciente.Nombre = datosPaciente.Nombre?.toUpperCase() || '';
        datosPaciente.Domicilio = datosPaciente.Domicilio?.toUpperCase() || '';
        datosPaciente.Sexo = datosPaciente.Sexo?.toUpperCase() || '';
  
        // Verificar si Carnet es nulo, undefined o cadena vacía
        if (datosPaciente.Carnet === undefined || datosPaciente.Carnet === null || datosPaciente.Carnet === '') {
          datosPaciente.Carnet = uuidv4().replace(/-/g, '').substring(0, 8);
        }
  
        // Validar si el Carnet es un valor no vacío antes de intentar guardarlo
        if (datosPaciente.Carnet.trim() !== '') {
          const pacienteExistente = await this.pacienteRepository.findOne({ where: { Carnet: datosPaciente.Carnet } });
  
          if (pacienteExistente === null) {
            const pacienteCreado = await this.pacienteRepository.save(datosPaciente);
            return pacienteCreado;
          } else {
            throw new HttpException('Ya existe un paciente con este carnet', HttpStatus.BAD_REQUEST);
          }
        } else {
          throw new HttpException('Error al crear el paciente: Carnet no válido', HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException('Error al crear el paciente: Datos del paciente no proporcionados', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('Error en crearPaciente:', error);
      throw new HttpException('Error interno al crear el paciente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
  
  async getAllPacientes(): Promise<Paciente[]> {
    const pacientes = await this.pacienteRepository.find({ where: { active: true } });

    // Convertir la edad a una cadena con el formato deseado
    pacientes.forEach((paciente) => {
      const fechaNacimiento = new Date(paciente.FechaNacimiento);
      paciente.Edad = this.fechaService.convertirFechaNacimiento(fechaNacimiento);
    });
    return pacientes;
  }
  
  async getAllPacientesDesactivated(): Promise<Paciente[]> {
    return await this.pacienteRepository.find({ where: { active: false } });
  }

  async getPaciente(idPaciente: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({ where: { ID_Paciente: idPaciente } });
  
    // Convertir la edad a una cadena con el formato deseado
    if (paciente && paciente.FechaNacimiento) {
      const fechaNacimiento = new Date(paciente.FechaNacimiento);
      paciente.Edad = this.fechaService.convertirFechaNacimiento(fechaNacimiento);
    }
  
    return paciente;
  }
  
  async editarPaciente(idPaciente: number, pacienteData: Partial<Paciente>): Promise<Paciente> {
    try {
      const pacienteActualizado = await this.pacienteRepository.findOne({ where: { ID_Paciente: idPaciente } });
  
      if (!pacienteActualizado) {
        throw new Error(`Paciente ${idPaciente} no encontrado`);
      }
  
      // Convertir campos a mayúsculas si existen en el pacienteData
      if (pacienteData.Nombre) {
        pacienteData.Nombre = pacienteData.Nombre.toUpperCase();
      }
  
      if (pacienteData.Domicilio) {
        pacienteData.Domicilio = pacienteData.Domicilio.toUpperCase();
      }
  
      if (pacienteData.Sexo) {
        pacienteData.Sexo = pacienteData.Sexo.toUpperCase();
      }
  
      // Verificar si Carnet es nulo, undefined o cadena vacía
      if (pacienteData.Carnet === undefined || pacienteData.Carnet === null || pacienteData.Carnet === '') {
        pacienteData.Carnet = uuidv4().replace(/-/g, '').substring(0, 8);
      }
  
      // Actualiza las propiedades del paciente con los datos recibidos
      Object.assign(pacienteActualizado, pacienteData);
  
      // Actualiza el campo timestampLlegada con el valor del sistema
      pacienteActualizado.timestampLlegada = new Date();
  
      const pacienteGuardado = await this.pacienteRepository.save(pacienteActualizado);
  
      return pacienteGuardado;
    } catch (error) {
      console.error('Error en editarPaciente:', error);
      throw new HttpException('Error interno al editar el paciente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  



  async eliminarPaciente(idPaciente: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOneOrFail({ where: { ID_Paciente: idPaciente } });
    paciente.active = !paciente.active;
    return this.pacienteRepository.save(paciente);
  }
  async toggleEnEspera(pacienteId: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({ where: { ID_Paciente: pacienteId } });
  
    if (!paciente) {
      throw new HttpException(`Paciente con ID ${pacienteId} no encontrado`, HttpStatus.NOT_FOUND);
    }
  
    // Almacena el valor anterior de enEspera
    const enEsperaAnterior = paciente.enEspera;
  
    // Cambia automáticamente el estado de enEspera de true a false y viceversa
    paciente.enEspera = !paciente.enEspera;
  
    // Asigna la fecha actual a timestampLlegada
    paciente.timestampLlegada = new Date();
  
    const pacienteActualizado = await this.pacienteRepository.save(paciente);
  
    // Emite el evento si el estado 'enEspera' ha cambiado
    if (enEsperaAnterior !== pacienteActualizado.enEspera) {
      this.socketGateway.server.emit('enEsperaCambiado', { pacienteId: pacienteActualizado.ID_Paciente, enEspera: pacienteActualizado.enEspera });
    }
  
    return pacienteActualizado;
  }
  
  
}
