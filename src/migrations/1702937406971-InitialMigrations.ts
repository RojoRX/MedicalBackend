import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrations1702937406971 implements MigrationInterface {
    name = 'InitialMigrations1702937406971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`examen_general\` (\`ID_ExamenGeneral\` int NOT NULL AUTO_INCREMENT, \`FrecuenciaCardiaca\` int NOT NULL, \`FrecuenciaRespiratoria\` int NOT NULL, \`Temperatura\` int NOT NULL, \`PresionArterial\` varchar(255) NOT NULL, \`Talla\` int NOT NULL, \`Peso\` int NOT NULL, \`ID_Consulta\` int NOT NULL, PRIMARY KEY (\`ID_ExamenGeneral\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`examen_fisico_regional\` (\`ID_ExamenFisico\` int NOT NULL AUTO_INCREMENT, \`ID_Consulta\` int NOT NULL, \`Observaciones\` varchar(100) NOT NULL, PRIMARY KEY (\`ID_ExamenFisico\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`examenes_complementarios\` (\`ID_ExamenComplementario\` int NOT NULL AUTO_INCREMENT, \`ID_Consulta\` int NOT NULL, \`Tipo_Examen\` varchar(120) NOT NULL, \`Resultados\` text NOT NULL, PRIMARY KEY (\`ID_ExamenComplementario\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`diagnostico_tratamiento\` (\`ID_DiagnosticoTratamiento\` int NOT NULL AUTO_INCREMENT, \`Diagnostico\` varchar(255) NOT NULL, \`Tratamiento\` varchar(255) NOT NULL, \`consultaIDConsulta\` int NULL, PRIMARY KEY (\`ID_DiagnosticoTratamiento\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`consulta\` (\`ID_Consulta\` int NOT NULL AUTO_INCREMENT, \`Fecha\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`Motivo_Consulta\` text NOT NULL, \`Nombre_Doctor\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`EnEspera\` tinyint NOT NULL DEFAULT 0, \`ID_Paciente\` int NULL, PRIMARY KEY (\`ID_Consulta\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`paciente\` (\`ID_Paciente\` int NOT NULL AUTO_INCREMENT, \`Nombre\` varchar(255) NOT NULL, \`Edad\` int NULL, \`Sexo\` varchar(10) NOT NULL, \`Domicilio\` varchar(255) NOT NULL, \`Carnet\` decimal NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`enEspera\` tinyint NOT NULL DEFAULT 0, \`timestampLlegada\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`contacto\` int NULL, UNIQUE INDEX \`IDX_547c56c2a81dbe726e55b3ceb4\` (\`Carnet\`), PRIMARY KEY (\`ID_Paciente\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`antecedentes_personales\` (\`ID_Antecedente\` int NOT NULL AUTO_INCREMENT, \`Enfermedad_Previa\` varchar(255) NOT NULL, \`Medicamento\` varchar(255) NOT NULL, \`pacienteId\` int NULL, PRIMARY KEY (\`ID_Antecedente\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`paciente_en_espera\` (\`ID_Paciente\` int NOT NULL AUTO_INCREMENT, \`Nombre\` varchar(255) NOT NULL, \`Edad\` decimal(5,2) NOT NULL, \`Sexo\` varchar(255) NOT NULL, \`Domicilio\` varchar(255) NOT NULL, \`Carnet\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`enEspera\` tinyint NOT NULL DEFAULT 0, \`timestampLlegada\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`horaLlegada\` varchar(255) NULL, \`contacto\` int NOT NULL, PRIMARY KEY (\`ID_Paciente\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`examen_general\` ADD CONSTRAINT \`FK_a3747dd2bd3e453174f77553682\` FOREIGN KEY (\`ID_Consulta\`) REFERENCES \`consulta\`(\`ID_Consulta\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`examen_fisico_regional\` ADD CONSTRAINT \`FK_b5c69bde742fbab967dd05e9b10\` FOREIGN KEY (\`ID_Consulta\`) REFERENCES \`consulta\`(\`ID_Consulta\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`examenes_complementarios\` ADD CONSTRAINT \`FK_ca87c7b3db832da3dbe9f70d3f4\` FOREIGN KEY (\`ID_Consulta\`) REFERENCES \`consulta\`(\`ID_Consulta\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diagnostico_tratamiento\` ADD CONSTRAINT \`FK_c196b34a3be0a601742a09048b2\` FOREIGN KEY (\`consultaIDConsulta\`) REFERENCES \`consulta\`(\`ID_Consulta\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD CONSTRAINT \`FK_053eafdf386d8ecaa86cd9d6f3f\` FOREIGN KEY (\`ID_Paciente\`) REFERENCES \`paciente\`(\`ID_Paciente\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`antecedentes_personales\` ADD CONSTRAINT \`FK_2b91e83b7e8dd0e15b785b42727\` FOREIGN KEY (\`pacienteId\`) REFERENCES \`paciente\`(\`ID_Paciente\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`antecedentes_personales\` DROP FOREIGN KEY \`FK_2b91e83b7e8dd0e15b785b42727\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP FOREIGN KEY \`FK_053eafdf386d8ecaa86cd9d6f3f\``);
        await queryRunner.query(`ALTER TABLE \`diagnostico_tratamiento\` DROP FOREIGN KEY \`FK_c196b34a3be0a601742a09048b2\``);
        await queryRunner.query(`ALTER TABLE \`examenes_complementarios\` DROP FOREIGN KEY \`FK_ca87c7b3db832da3dbe9f70d3f4\``);
        await queryRunner.query(`ALTER TABLE \`examen_fisico_regional\` DROP FOREIGN KEY \`FK_b5c69bde742fbab967dd05e9b10\``);
        await queryRunner.query(`ALTER TABLE \`examen_general\` DROP FOREIGN KEY \`FK_a3747dd2bd3e453174f77553682\``);
        await queryRunner.query(`DROP TABLE \`paciente_en_espera\``);
        await queryRunner.query(`DROP TABLE \`antecedentes_personales\``);
        await queryRunner.query(`DROP INDEX \`IDX_547c56c2a81dbe726e55b3ceb4\` ON \`paciente\``);
        await queryRunner.query(`DROP TABLE \`paciente\``);
        await queryRunner.query(`DROP TABLE \`consulta\``);
        await queryRunner.query(`DROP TABLE \`diagnostico_tratamiento\``);
        await queryRunner.query(`DROP TABLE \`examenes_complementarios\``);
        await queryRunner.query(`DROP TABLE \`examen_fisico_regional\``);
        await queryRunner.query(`DROP TABLE \`examen_general\``);
    }

}
