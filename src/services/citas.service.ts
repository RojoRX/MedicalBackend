import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cita } from "src/entities/citas/citas.entity";
import { SocketGateway } from "src/gateways/events.gateway";
import { FechaService } from "src/utils/birthDate";
import { Between, Repository } from "typeorm";

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
    private socketGateway: SocketGateway,
    private fechaService: FechaService,
  ) { }

  async findAll(): Promise<any[]> {
    const citas = await this.citasRepository.find({ where: { enEspera: true } });
    return Promise.all(
      citas.map(async (cita) => {
        const { paciente, fecha_cita, ...citaData } = cita;
        const { ID_Paciente, Nombre, FechaNacimiento, Sexo, Domicilio, Carnet, active, enEspera, timestampLlegada, contacto } = paciente;

        // Formatear la fecha en un formato legible (día, mes y hora)
        const formattedFechaCita = new Intl.DateTimeFormat('es-ES', {
          day: 'numeric',
          month: 'long',
          hour: 'numeric',
          minute: 'numeric',
        }).format(new Date(fecha_cita));

        // Convertir la FechaNacimiento a la Edad en el formato deseado
        let edad = null;
        if (FechaNacimiento) {
          const fechaNacimiento = new Date(FechaNacimiento);
          edad = this.fechaService.convertirFechaNacimiento(fechaNacimiento);
        }

        return {
          id: ID_Paciente, // Asignar un id único basado en el ID_Paciente
          ...citaData,
          ID_Paciente,
          Nombre,
          FechaNacimiento,
          Edad: edad, // Usar la edad calculada
          Sexo,
          Domicilio,
          Carnet,
          active,
          enEspera,
          timestampLlegada,
          contacto,
          fecha_cita: formattedFechaCita,
        };
      })
    );
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

      const formattedCitas = await Promise.all(
        citas.map(async (cita) => {
          const { paciente, fecha_cita, ...citaData } = cita;
          const {
            ID_Paciente,
            Nombre,
            FechaNacimiento,
            Sexo,
            Domicilio,
            Carnet,
            active,
            enEspera,
            timestampLlegada,
            contacto,
          } = paciente;

          // Convertir la FechaNacimiento a la Edad en el formato deseado
          let edad = null;
          if (FechaNacimiento) {
            const fechaNacimiento = new Date(FechaNacimiento);
            edad = this.fechaService.convertirFechaNacimiento(fechaNacimiento);
          }

          const formattedFechaCita = new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(fecha_cita));

          return {
            id: ID_Paciente, // Asignar un id único basado en el ID_Paciente
            ...citaData,
            ID_Paciente,
            Nombre,
            FechaNacimiento,
            Edad: edad, // Usar la edad calculada
            Sexo,
            Domicilio,
            Carnet,
            active,
            enEspera,
            timestampLlegada,
            contacto,
            fecha_cita: formattedFechaCita,
          };
        })
      );

      return { status: 'success', data: formattedCitas };
    } catch (error) {
      console.error('Error fetching citas by day:', error);
      return { status: 'error', message: 'Error fetching citas by day' };
    }
  }
  async getCitasPorDia(fecha: Date): Promise<any> {
    try {
      const startOfDay = new Date(fecha);
      startOfDay.setHours(0, 0, 0, 0);
  
      // Cambiar la hora al final del día para incluir eventos hasta la medianoche
      const endOfDay = new Date(fecha);
      endOfDay.setHours(23, 59, 59, 999);
  
      const citasPorDia = await this.getCitasPorRangoDeFechas(fecha.toISOString().split('T')[0], fecha.toISOString().split('T')[0]);
      //console.log('Citas por día:', citasPorDia);
  
      const statsPorDia = this.calcularEstadisticas(citasPorDia);
      //console.log('Stats por día:', statsPorDia);
  
      return { porDia: statsPorDia };
    } catch (error) {
      // Manejar el error
      console.error('Error en getCitasPorDia:', error);
      throw error;
    }
  }
  

  async getCitasPorMes(fecha: Date): Promise<any> {
    try {
      const startOfMonth = fecha.toISOString().split('T')[0].substring(0, 7) + '-01';
      const endOfMonth = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).toISOString().split('T')[0];
  
      const citasPorMes = await this.getCitasPorRangoDeFechas(startOfMonth, endOfMonth);
      const statsPorMes = this.calcularEstadisticas(citasPorMes);
  
      return { porMes: statsPorMes };
    } catch (error) {
      // Manejar el error
      console.error('Error en getCitasPorMes:', error);
      throw error;
    }
  }
  
  private async getCitasPorRangoDeFechas(start: string, end: string): Promise<Cita[]> {
    // Convertir las fechas a formato YYYY-MM-DD
    const startStr = start + 'T00:00:00';
    const endStr = end + 'T23:59:59';
  
    // Convertir las cadenas de fecha y hora a objetos Date
    const startLocal = new Date(startStr);
    const endLocal = new Date(endStr);
  
    // Consultar utilizando las fechas en formato de objeto Date
    return this.citasRepository.find({ where: { fecha_cita: Between(startLocal, endLocal) } });
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



  /*
    async getCitasPorDiaYMes(fecha: Date): Promise<any> {
      try {
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
    } catch (error) {
        // Manejar el error
        console.error('Error en getCitasPorDiaYMes:', error);
        throw error;
    }
  }
    
  
  private async getCitasPorRangoDeFechas(start: Date, end: Date): Promise<Cita[]> {
    // Asegurarse de que las fechas estén en formato UTC
    const startUtc = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0, 0));
    const endUtc = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999));
  
    return this.citasRepository.find({ where: { fecha_cita: Between(startUtc, endUtc) } });
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
    */


}
