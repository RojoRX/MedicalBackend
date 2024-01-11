
/*import { createConnection } from 'typeorm';
import { Paciente } from './pacientes/paciente.entity';

async function seed() {
  const connection = await createConnection();

  // Datos de ejemplo para insertar en la tabla Paciente
  const pacientesData = [
    { Nombre: 'Juan', fechaNacimiento: '2000-01-04', Edad: 30, Sexo: 'Masculino', Domicilio: 'Calle A, Ciudad X', Carnet: 12344444 },
    { Nombre: 'María', fechaNacimiento: '2000-01-04', Edad: 25, Sexo: 'Femenino', Domicilio: 'Calle B, Ciudad Y', Carnet: 45688888 },
    // Agrega más datos según sea necesario
  ];

  // Insertar datos en la tabla Paciente
  await connection.getRepository(Paciente).save(pacientesData);

  // Cerrar la conexión después de insertar los datos
  await connection.close();

  console.log('Datos de pacientes insertados correctamente.');
}

// Ejecutar la semilla
seed();*/
