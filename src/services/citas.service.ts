import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cita } from "src/entities/citas/citas.entity";
import { SocketGateway } from "src/gateways/events.gateway";
import { Repository } from "typeorm";

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
    private socketGateway: SocketGateway,
  ) {}

  async findAll(): Promise<any[]> {
    const citas = await this.citasRepository.find({ where: { enEspera: true } });
  
    return citas.map((cita) => {
      const { paciente, fecha_cita, ...citaData } = cita;
      const { ID_Paciente, Nombre, FechaNacimiento, Edad, Sexo, Domicilio, Carnet, active, enEspera, timestampLlegada, contacto } = paciente;
  
      // Formatear la fecha en un formato legible (día, mes y hora)
      const formattedFechaCita = new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric',
      }).format(new Date(fecha_cita));
  
      return {
        ...citaData,
        ID_Paciente,
        Nombre,
        FechaNacimiento,
        Edad,
        Sexo,
        Domicilio,
        Carnet,
        active,
        enEspera,
        timestampLlegada,
        contacto,
        fecha_cita: formattedFechaCita,
      };
    });
  }
  
  
  
  // Encontrar una cita
  async findOne(id: number): Promise<any> {
    const cita = await this.citasRepository.findOne({where:{id_cita:id}});
    if (cita) {
      const { paciente, ...citaData } = cita;
      const { ID_Paciente, Nombre, FechaNacimiento, Edad, Sexo, Domicilio, Carnet, active, enEspera, timestampLlegada, contacto } = paciente;
      return { 
        status: 'success', 
        message: 'Cita encontrada', 
        data: { 
          ...citaData, 
          ID_Paciente, 
          Nombre, 
          FechaNacimiento, 
          Edad, 
          Sexo, 
          Domicilio, 
          Carnet, 
          active, 
          enEspera, 
          timestampLlegada, 
          contacto 
        } 
      };
    } else {
      return { status: 'error', message: 'Cita no encontrada' };
    }
  }
  
   // Crear una nueva cita
   async create(cita: Cita): Promise<any> {
    try {
      const createdCita = await this.citasRepository.save(cita);

      if (createdCita) {
        this.socketGateway.server.emit('Socket emitido');
        return { status: 'success', message: 'Cita creada correctamente', cita: createdCita };
      } else {
        return { status: 'error', message: 'No se pudo crear la cita' };
      }
    } catch (error) {
      return { status: 'error', message: 'Error al crear la cita', error: error.message };
    }
  }
// Actualizar una cita
async update(id: number, cita: Cita): Promise<any> {
  const updateResult = await this.citasRepository.update(id, cita);
  if (updateResult.affected > 0) {
    this.socketGateway.server.emit('Socket emitido');
    return { status: 'success', message: 'Cita actualizada correctamente' };
  } else {
    return { status: 'error', message: 'No se pudo actualizar la cita' };
  }
}

// Borrar una cita
async delete(id: number): Promise<any> {
  const deleteResult = await this.citasRepository.delete(id);
  if (deleteResult.affected > 0) {
    this.socketGateway.server.emit('Socket emitido');
    return { status: 'success', message: 'Cita eliminada correctamente' };
  } else {
    return { status: 'error', message: 'No se pudo eliminar la cita' };
  }
}

// ...

// Actualizar el campo enEspera de una cita
async updateEnEspera(id: number): Promise<any> {
  try {
    const cita = await this.citasRepository.findOne({ where: { id_cita: id } });

    if (!cita) {
      return { status: 'error', message: 'Cita no encontrada' };
    }

    cita.enEspera = !cita.enEspera; // Asignar el valor contrario

    await this.citasRepository.save(cita);

    this.socketGateway.server.emit('Socket emitido');
    return { status: 'success', message: 'Campo enEspera actualizado correctamente', cita };
  } catch (error) {
    return { status: 'error', message: 'Error al actualizar el campo enEspera', error: error.message };
  }
}

}
