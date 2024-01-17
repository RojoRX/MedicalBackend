import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioController } from './controllers/test/test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/pacientes/paciente.entity';
import { PacienteModule } from './modules/paciente.module';
import { Consulta } from './entities/consulta/consulta.entity';
import { AntecedentesPersonales } from './entities/antecedentes/antecedentes-personales.entity';
import { ConsultaModule } from './modules/consulta.module';
import { ExamenGeneral } from './entities/examen-general/examen-general.entity';
import { ExamenFisicoRegional } from './entities/examen-fisico-regional/examen-fisico-regional.entity';
import { ExamenGeneralModule } from './modules/examen-general.module';
import { ExamenFisicoRegionalModule } from './modules/examen-fisico-regional.module';
import { ExamenesComplementarios } from './entities/examenes-complementarios/examenes-complementarios.entity';
import { ExamenesComplementariosModule } from './modules/examenes-complementarios.module';
import { DiagnosticoTratamiento } from './entities/diagnostico-tratamiento/diagnostico-tratamiento.entity';
import { DiagnosticoTratamientoModule } from './modules/diagnostico-tratamiento.module';
import { AllDataController } from './proc_alm/all-data-pacient.controller';
import { AllDataService } from './proc_alm/all-data-pacient.service';
import { LastDataController } from './proc_alm/last-data-pacient.controller';
import { LastDataService } from './proc_alm/last-data-pacient.service';
import { AllConsultController } from './proc_alm/all-consultation-pacient.controller';
import { AllConsultService } from './proc_alm/all-consultation-pacient.service';


import { PacientesEnEsperaModule } from './modules/pacientesEnEsperaModule.module';
import { PacienteEnEspera } from './entities/pacienteEnEspera/pacienteEspera.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CitasModule } from './modules/citas.module';
import { AntecedentesPersonalesModule } from './modules/antecedentes-personales.module';
import { InformeModule } from './modules/informe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: process.env.TYPEORM_CONNECTION as any,
        host: process.env.TYPEORM_HOST,
        port: +process.env.TYPEORM_PORT,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        entities: [process.env.TYPEORM_ENTITIES],
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'false',
        migrations: [process.env.TYPEORM_MIGRATIONS],
        logging: process.env.TYPEORM_LOGGING === 'true',
      }),
      inject: [ConfigService],
    }), PacienteModule, AntecedentesPersonales, ConsultaModule, 
    ExamenGeneralModule, ExamenFisicoRegionalModule, ExamenesComplementariosModule, DiagnosticoTratamientoModule, PacientesEnEsperaModule,
    CitasModule, AntecedentesPersonalesModule, InformeModule
  ],
  controllers: [AppController, UsuarioController, AllDataController, LastDataController, AllConsultController],
  providers: [AppService, AllDataService, LastDataService, AllConsultService],
})

export class AppModule {

}