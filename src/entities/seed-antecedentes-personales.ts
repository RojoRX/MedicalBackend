// seed-antecedentes-personales.ts
/*
import { createConnection } from 'typeorm';
import { AntecedentesPersonales } from './antecedentes/antecedentes-personales.entity';
import { Paciente } from './pacientes/paciente.entity';

const antecedentesPersonalesData = [
    { Enfermedad_Previa: 'Hipertensión', Medicamento: 'Losartán', pacienteId: 1 },
    { Enfermedad_Previa: 'Asma', Medicamento: 'Ventolin', pacienteId: 2 },
    // Agrega más datos según sea necesario
  ];
  
  async function seedAntecedentesPersonales() {
    const connection = await createConnection();
  
    for (const data of antecedentesPersonalesData) {
      const antecedentesPersonales = new AntecedentesPersonales();
      antecedentesPersonales.Enfermedad_Previa = data.Enfermedad_Previa;
      antecedentesPersonales.Medicamento = data.Medicamento;
      
      const paciente = await connection.getRepository(Paciente).findByIds([data.pacienteId]);
      if (paciente.length > 0) {
        antecedentesPersonales.paciente = paciente[0];
        await connection.manager.save(antecedentesPersonales);
      } else {
        console.error(`No se encontró el paciente con ID ${data.pacienteId}`);
      }
    }
  
    await connection.close();
  }
  
  seedAntecedentesPersonales();*/