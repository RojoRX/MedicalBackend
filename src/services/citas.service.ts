import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cita } from "src/entities/citas/citas.entity";
import { Repository } from "typeorm";

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
  ) {}

  async findAll(): Promise<any[]> {
    const citas = await this.citasRepository.find({where: { enEspera: true }});
    return citas.map(cita => {
      const { paciente, ...citaData } = cita;
      const { ID_Paciente, Nombre, FechaNacimiento, Edad, Sexo, Domicilio, Carnet, active, enEspera, timestampLlegada, contacto } = paciente;
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
        contacto 
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
   async create(cita: Cita): Promise<Cita> {
    return await this.citasRepository.save(cita);
  }

  // Actualizar una cita
  async update(id: number, cita: Cita): Promise<any> {
    const updateResult = await this.citasRepository.update(id, cita);
    if (updateResult.affected > 0) {
      return { status: 'success', message: 'Cita actualizada correctamente' };
    } else {
      return { status: 'error', message: 'No se pudo actualizar la cita' };
    }
  }

  // Borrar una cita
  async delete(id: number): Promise<any> {
    const deleteResult = await this.citasRepository.delete(id);
    if (deleteResult.affected > 0) {
      return { status: 'success', message: 'Cita eliminada correctamente' };
    } else {
      return { status: 'error', message: 'No se pudo eliminar la cita' };
    }
  }
  // ...
}
