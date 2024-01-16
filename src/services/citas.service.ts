import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cita } from "src/entities/citas/citas.entity";
import { SocketGateway } from "src/gateways/events.gateway";
import { Between, Repository } from "typeorm";

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
    private socketGateway: SocketGateway,
  ) { }

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
    const cita = await this.citasRepository.findOne({ where: { id_cita: id } });
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
  // Obtener todas las citas por día
  async findByDay(day: string): Promise<{ status: string; message?: string; data?: any[] }> {
    try {
      const startOfDay = new Date(`${day}T00:00:00`);
      const endOfDay = new Date(`${day}T23:59:59`);

      const citas = await this.citasRepository.find({
        where: {
          fecha_cita: Between(startOfDay, endOfDay),
        },
      });

      const formattedCitas = citas.map((cita) => {
        const { paciente, fecha_cita, ...citaData } = cita;
        const {
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
        } = paciente;

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

      return { status: 'success', data: formattedCitas };
    } catch (error) {
      console.error('Error fetching citas by day:', error);
      return { status: 'error', message: 'Error fetching citas by day' };
    }
  }

  async getCitasPorDiaYMes(fecha: Date): Promise<any> {
    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);
  
    const startOfMonth = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const endOfMonth = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59, 999);
  
    const citasPorDia = await this.getCitasPorRangoDeFechas(startOfDay, endOfDay);
    const citasPorMes = await this.getCitasPorRangoDeFechas(startOfMonth, endOfMonth);
  
    const statsPorDia = this.calcularEstadisticas(citasPorDia);
    const statsPorMes = this.calcularEstadisticas(citasPorMes);
  
    return { porDia: statsPorDia, porMes: statsPorMes };
  }
  
  private async getCitasPorRangoDeFechas(start: Date, end: Date): Promise<Cita[]> {
    return this.citasRepository.find({ where: { fecha_cita: Between(start, end) } });
  }
  
  private calcularEstadisticas(citas: Cita[]): any {
    const stats = {
      totalCitas: citas.length,
      consultas: 0,
      reconsultas: 0,
      emergencias: 0,
      adultoMayor: 0,
      doctores: {
        'Dr. Silvio Ramiro Zarate': { totalCitas: 0, consultas: 0, reconsultas: 0, emergencias: 0, adultoMayor: 0 },
        'Dra. Janneth Condori Llanos': { totalCitas: 0, consultas: 0, reconsultas: 0, emergencias: 0, adultoMayor: 0 },
        'Dra. Sara Montesinos': { totalCitas: 0, consultas: 0, reconsultas: 0, emergencias: 0, adultoMayor: 0 },
        'Dra. Patricia Nardin Mainz': { totalCitas: 0, consultas: 0, reconsultas: 0, emergencias: 0, adultoMayor: 0 },
      },
    };
  
    citas.forEach((cita) => {
      switch (cita.tipo_consulta) {
        case 'consulta':
          stats.consultas++;
          break;
        case 'reconsulta':
          stats.reconsultas++;
          break;
        case 'emergencia':
          stats.emergencias++;
          break;
        case 'adulto mayor':
          stats.adultoMayor++;
          break;
      }
  
      // Actualizar estadísticas para cada doctor
      if (stats.doctores.hasOwnProperty(cita.doctor)) {
        const doctorStats = stats.doctores[cita.doctor];
        doctorStats.totalCitas++;
        switch (cita.tipo_consulta) {
          case 'consulta':
            doctorStats.consultas++;
            break;
          case 'reconsulta':
            doctorStats.reconsultas++;
            break;
          case 'emergencia':
            doctorStats.emergencias++;
            break;
          case 'adulto mayor':
            doctorStats.adultoMayor++;
            break;
        }
      }
    });
  
    return stats;
  }
  
  
  
}
