import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AntecedentesPersonales } from "src/entities/antecedentes/antecedentes-personales.entity";
import { Paciente } from "src/entities/pacientes/paciente.entity";

@Injectable()
export class AntecedentesPersonalesService {
  constructor(
    @InjectRepository(AntecedentesPersonales)
    private antecedentesRepository: Repository<AntecedentesPersonales>,
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) {}

  async getAntecedentesByPacienteId(pacienteId: number): Promise<AntecedentesPersonales[]> {
    return this.antecedentesRepository.find({
      where: { paciente: { ID_Paciente: pacienteId } },
    });
  }

  async createAntecedente(pacienteId: number, antecedenteData: AntecedentesPersonales): Promise<AntecedentesPersonales> {
    const paciente = await this.pacienteRepository.findOne({ where: { ID_Paciente: pacienteId } });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${pacienteId} no encontrado`);
    }

    const nuevoAntecedente = this.antecedentesRepository.create(antecedenteData);
    nuevoAntecedente.paciente = paciente;

    return this.antecedentesRepository.save(nuevoAntecedente);
  }

  async updateAntecedente(idAntecedente: number, antecedenteData: AntecedentesPersonales): Promise<AntecedentesPersonales> {
    const antecedente = await this.antecedentesRepository.findOne({where: {ID_Antecedente:idAntecedente}});

    if (!antecedente) {
      throw new NotFoundException(`Antecedente con ID ${idAntecedente} no encontrado`);
    }

    this.antecedentesRepository.merge(antecedente, antecedenteData);
    return this.antecedentesRepository.save(antecedente);
  }

  async deleteAntecedente(idAntecedente: number): Promise<void> {
    const antecedente = await this.antecedentesRepository.findOne({where: {ID_Antecedente:idAntecedente}});

    if (!antecedente) {
      throw new NotFoundException(`Antecedente con ID ${idAntecedente} no encontrado`);
    }

    await this.antecedentesRepository.remove(antecedente);
  }
}
