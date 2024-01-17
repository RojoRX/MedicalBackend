use saludvida;
DELIMITER //
CREATE PROCEDURE InsertarDatosConsulta(
    IN p_ID_Cita INT,
    IN p_FrecuenciaCardiaca INT,
    IN p_FrecuenciaRespiratoria INT,
    IN p_Temperatura FLOAT,
    IN p_PresionArterial VARCHAR(20),
    IN p_Talla INT,
    IN p_Peso INT,
    IN p_ObservacionesExamenFisico VARCHAR(100),
    IN p_TipoExamenComplementario VARCHAR(120),
    IN p_ResultadosExamenComplementario TEXT,
    IN p_Diagnostico TEXT,
    IN p_Tratamiento TEXT
)
BEGIN
    DECLARE v_ID_Consulta INT;
    -- Obtener el ID de la consulta existente
    SELECT ID_Consulta INTO v_ID_Consulta
    FROM consulta
    WHERE ID_Consulta = p_ID_Cita;
    -- Insertar datos en examen_general
    INSERT INTO examen_general (ID_Consulta, FrecuenciaCardiaca, FrecuenciaRespiratoria, Temperatura, PresionArterial, Talla, Peso)
    VALUES (v_ID_Consulta, p_FrecuenciaCardiaca, p_FrecuenciaRespiratoria, p_Temperatura, p_PresionArterial, p_Talla, p_Peso);
    -- Insertar datos en examen_fisico_regional
    INSERT INTO examen_fisico_regional (ID_Consulta, Observaciones)
    VALUES (v_ID_Consulta, p_ObservacionesExamenFisico);
    -- Insertar datos en examenes_complementarios
    INSERT INTO examenes_complementarios (ID_Consulta, Tipo_Examen, Resultados)
    VALUES (v_ID_Consulta, p_TipoExamenComplementario, p_ResultadosExamenComplementario);
    -- Insertar datos en diagnostico_tratamiento
    INSERT INTO diagnostico_tratamiento (Diagnostico, Tratamiento, consultaIDConsulta)
    VALUES (p_Diagnostico, p_Tratamiento, v_ID_Consulta);
END //

DELIMITER //

CREATE PROCEDURE ObtenerDatosPacienteConsulta(
    IN p_ID_Paciente INT,
    IN p_ID_Consulta INT
)
BEGIN
    -- Obtener todos los datos para un paciente en una sola consulta
    SELECT
        paciente.*,
        DATE_FORMAT(consulta.Fecha, '%d de %M de %Y, %H:%i') AS Fecha_Consulta,
        consulta.Motivo_Consulta,
        consulta.Nombre_Doctor,
        examen_general.*,
        examen_fisico_regional.*,
        examenes_complementarios.*,
        diagnostico_tratamiento.*
    FROM paciente
    JOIN consulta ON paciente.ID_Paciente = consulta.ID_Paciente
    LEFT JOIN examen_general ON consulta.ID_Consulta = examen_general.ID_Consulta
    LEFT JOIN examen_fisico_regional ON consulta.ID_Consulta = examen_fisico_regional.ID_Consulta
    LEFT JOIN examenes_complementarios ON consulta.ID_Consulta = examenes_complementarios.ID_Consulta
    LEFT JOIN diagnostico_tratamiento ON consulta.ID_Consulta = diagnostico_tratamiento.consultaIDConsulta
    WHERE paciente.ID_Paciente = p_ID_Paciente AND consulta.ID_Consulta = p_ID_Consulta;
END //

DELIMITER //

CREATE PROCEDURE ObtenerDatosUltimaConsulta(
    IN p_ID_Paciente INT
)
BEGIN
    DECLARE v_ID_Consulta INT;
    -- Configurar el lenguaje de la fecha en español
    SET lc_time_names = 'es_ES';
    -- Obtener el ID de la última consulta para el paciente
    SELECT MAX(ID_Consulta) INTO v_ID_Consulta
    FROM consulta
    WHERE ID_Paciente = p_ID_Paciente;
    -- Obtener todos los datos para el paciente en la última consulta
    SELECT
        paciente.*,
        DATE_FORMAT(consulta.Fecha, '%d de %M de %Y, %H:%i') AS Fecha_Consulta,
        consulta.Motivo_Consulta,
        consulta.Nombre_Doctor,
        consulta.EnEspera,
        examen_general.*,
        examen_fisico_regional.*,
        examenes_complementarios.*,
        diagnostico_tratamiento.*
    FROM paciente
    JOIN consulta ON paciente.ID_Paciente = consulta.ID_Paciente
    LEFT JOIN examen_general ON consulta.ID_Consulta = examen_general.ID_Consulta
    LEFT JOIN examen_fisico_regional ON consulta.ID_Consulta = examen_fisico_regional.ID_Consulta
    LEFT JOIN examenes_complementarios ON consulta.ID_Consulta = examenes_complementarios.ID_Consulta
    LEFT JOIN diagnostico_tratamiento ON consulta.ID_Consulta = diagnostico_tratamiento.consultaIDConsulta
    WHERE paciente.ID_Paciente = p_ID_Paciente AND consulta.ID_Consulta = v_ID_Consulta;
END //

DELIMITER //

CREATE PROCEDURE obtener_citas_paciente(paciente_id INT)
BEGIN
    SET lc_time_names = 'es_ES'; -- Establece la localización a español

    SELECT
        ID_Consulta,
        DATE_FORMAT(Fecha, '%d de %M de %Y, %H:%i') AS Fecha_Consulta,
        Motivo_Consulta,
        Nombre_Doctor,
        active,
        EnEspera
    FROM
        consulta
    WHERE
        ID_Paciente = paciente_id
    ORDER BY
        Fecha DESC
    LIMIT 10;
END //

DELIMITER //
CREATE TRIGGER after_paciente_update
AFTER UPDATE
ON paciente FOR EACH ROW
BEGIN
    IF NEW.enEspera <> OLD.enEspera THEN
        IF NEW.enEspera = true THEN
            INSERT INTO paciente_en_espera (ID_Paciente, Nombre, FechaNacimiento, Sexo, Domicilio, Carnet, active, enEspera, timestampLlegada, contacto)
            VALUES (NEW.ID_Paciente, NEW.Nombre, NEW.FechaNacimiento, NEW.Sexo, NEW.Domicilio, NEW.Carnet, NEW.active, NEW.enEspera, NEW.timestampLlegada, NEW.contacto);
        ELSE
            DELETE FROM paciente_en_espera WHERE ID_Paciente = OLD.ID_Paciente;
        END IF;
    END IF;
END //
DELIMITER //

CREATE TRIGGER before_paciente_insert_update
BEFORE INSERT ON paciente
FOR EACH ROW
SET NEW.Edad = FLOOR(DATEDIFF(CURDATE(), NEW.FechaNacimiento) / 365);
//

CREATE TRIGGER before_paciente_update
BEFORE UPDATE ON paciente
FOR EACH ROW
SET NEW.Edad = FLOOR(DATEDIFF(CURDATE(), NEW.FechaNacimiento) / 365);
//
DELIMITER ;
