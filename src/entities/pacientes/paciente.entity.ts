import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Consulta } from '../consulta/consulta.entity';
import { AntecedentesPersonales } from '../antecedentes/antecedentes-personales.entity';
import { Cita } from '../citas/citas.entity';

@Entity({

})
export class Paciente {
  @PrimaryGeneratedColumn()
  ID_Paciente: number;

  @Column({ length: 255 })
  Nombre: string;

  @Column({ type: 'date', nullable: true })
  FechaNacimiento: Date;
  
  @Column({ default: "null"})
  Edad: string;

  @Column({ length: 10 })
  Sexo: string;

  @Column({ length: 255 })
  Domicilio: string;

  @Column({ unique: true, type: 'numeric' })
  Carnet: number;

  @Column({ default: true }) // Agrega la propiedad active con valor por defecto true
  active: boolean;

  @Column({ default: false }) // Agrega la propiedad enEspera con valor por defecto false
  enEspera: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestampLlegada: Date;

  @Column({ default: 70000000 })
  contacto: number;

  @OneToMany(() => Consulta, consulta => consulta.paciente, { cascade: true })
  consultas: Consulta[];

  @OneToMany(() => AntecedentesPersonales, antecedentes => antecedentes.paciente)
  antecedentesPersonales: AntecedentesPersonales[];
  
  @OneToMany(() => Cita, cita => cita.paciente, { cascade: true })
  citas: Cita[];
}
