// En consulta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Paciente } from '../pacientes/paciente.entity';
import { ExamenGeneral } from '../examen-general/examen-general.entity';
import { ExamenFisicoRegional } from '../examen-fisico-regional/examen-fisico-regional.entity';
import { ExamenesComplementarios } from '../examenes-complementarios/examenes-complementarios.entity';
import { DiagnosticoTratamiento } from '../diagnostico-tratamiento/diagnostico-tratamiento.entity';
import { Cita } from '../citas/citas.entity';

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  ID_Consulta: number;

  @CreateDateColumn()
  Fecha: Date;

  @Column({ type: 'text' })
  Motivo_Consulta: string;

  @Column({ type: 'varchar', length: 255 })
  Nombre_Doctor: string;

  @Column({ type: 'boolean', default: true }) // Añade la propiedad active
  active: boolean;

  @Column({ type: 'boolean', default: false }) // Añade la propiedad EnEspera
  EnEspera: boolean;

  @ManyToOne(() => Paciente, paciente => paciente.consultas)
  @JoinColumn({ name: 'ID_Paciente' })
  paciente: Paciente;

  @OneToMany(() => ExamenGeneral, examenGeneral => examenGeneral.consulta)
  examenesGenerales: ExamenGeneral[];
  
  @OneToMany(() => ExamenFisicoRegional, (examen) => examen.consulta)
  examenesFisicosRegionales: ExamenFisicoRegional[];

  @OneToMany(() => ExamenesComplementarios, (examen) => examen.consulta)
  examenesComplementarios: ExamenesComplementarios[];
  
  @OneToMany(() => DiagnosticoTratamiento, diagnosticoTratamiento => diagnosticoTratamiento.consulta)
  diagnosticosTratamientos: DiagnosticoTratamiento[];

  @ManyToOne(() => Cita, cita => cita.consultas)
  @JoinColumn({ name: 'ID_Cita' })
  cita: Cita;
}
