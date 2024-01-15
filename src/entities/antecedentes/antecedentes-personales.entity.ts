import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from '../pacientes/paciente.entity';
@Entity()
export class AntecedentesPersonales {
  @PrimaryGeneratedColumn()
  ID_Antecedente: number;

  @Column({ type: 'text' })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToOne(() => Paciente, paciente => paciente.antecedentesPersonales)
  @JoinColumn({ name: 'ID_Paciente' })
  paciente: Paciente;
}
