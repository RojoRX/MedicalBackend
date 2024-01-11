import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PacienteEnEspera {
  @PrimaryGeneratedColumn()
  ID_Paciente: number;

  @Column()
  Nombre: string;

  @Column({ type: 'date', nullable: true })
  FechaNacimiento: Date;

  @Column({ default: "null"})
  Edad: string;
  
  @Column()
  Sexo: string;

  @Column()
  Domicilio: string;

  @Column()
  Carnet: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  enEspera: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestampLlegada: Date;

  @Column({ type: 'varchar', nullable: true })
  horaLlegada: string;
  
  @Column()
  contacto: number;
}
