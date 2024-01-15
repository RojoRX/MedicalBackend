import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Paciente } from '../pacientes/paciente.entity';
import { Consulta } from '../consulta/consulta.entity';

@Entity()
export class Cita {
  @PrimaryGeneratedColumn()
  id_cita: number;

  @ManyToOne(() => Paciente, paciente => paciente.citas, { eager: true })
  paciente: Paciente;

  @Column({ length: 255 })
  doctor: string;

  @Column({ type: 'enum', enum: ['consulta', 'reconsulta', 'emergencia', 'adulto mayor'] })
  tipo_consulta: string;

  @Column({ type: 'datetime' })
  fecha_cita: Date;

  @Column({ type: 'boolean', default: true })
  enEspera: boolean;
  
  @OneToMany(() => Consulta, consulta => consulta.cita, { cascade: true })
  consultas: Consulta[];
}
