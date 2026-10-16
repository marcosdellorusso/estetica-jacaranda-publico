import pool from '../index'

export async function createFichaSalud(data: any) {
  // Armá la lista de campos según tu tabla
  const {
    dni_usuario,
    enfermedad_diagnosticada,
    enfermedad_diagnosticada_cual,
    toma_medicacion,
    toma_medicacion_cual,
    antecedente_cancer,
    antecedente_cancer_cual,
    problemas_hormonales,
    problemas_hormonales_cual,
    enfermedad_piel,
    enfermedad_piel_cual,
    marcapasos_implantes_protesis,
    marcapasos_implantes_protesis_cual,
    tiene_tatuajes,
    tatuajes_donde,
    lunares_cicatrices_manchas,
    lunares_cicatrices_manchas_donde,
    considera_piel_sensible,
    usa_protector_solar,
    primera_vez_depilacion_definitiva,
    depilacion_definitiva_donde_cuando,
    metodo_depilacion_anterior,
    metodo_depilacion_anterior_cual,
    embarazo_lactancia,
    problemas_cardiacos_hipertension,
    problemas_cardiacos_hipertension_cual,
    alergias,
    alergias_cual,
    metodo_anticonceptivo_hormonal,
    metodo_anticonceptivo_hormonal_cual,
  } = data;

  await pool.query(`
    INSERT INTO ficha_salud (
      dni_usuario, enfermedad_diagnosticada, enfermedad_diagnosticada_cual,
      toma_medicacion, toma_medicacion_cual,
      antecedente_cancer, antecedente_cancer_cual,
      problemas_hormonales, problemas_hormonales_cual,
      enfermedad_piel, enfermedad_piel_cual,
      marcapasos_implantes_protesis, marcapasos_implantes_protesis_cual,
      tiene_tatuajes, tatuajes_donde,
      lunares_cicatrices_manchas, lunares_cicatrices_manchas_donde,
      considera_piel_sensible, usa_protector_solar,
      primera_vez_depilacion_definitiva, depilacion_definitiva_donde_cuando,
      metodo_depilacion_anterior, metodo_depilacion_anterior_cual,
      embarazo_lactancia,
      problemas_cardiacos_hipertension, problemas_cardiacos_hipertension_cual,
      alergias, alergias_cual,
      metodo_anticonceptivo_hormonal, metodo_anticonceptivo_hormonal_cual
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,
      $20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30
    );
  `, [
    dni_usuario,
    enfermedad_diagnosticada,
    enfermedad_diagnosticada_cual,
    toma_medicacion,
    toma_medicacion_cual,
    antecedente_cancer,
    antecedente_cancer_cual,
    problemas_hormonales,
    problemas_hormonales_cual,
    enfermedad_piel,
    enfermedad_piel_cual,
    marcapasos_implantes_protesis,
    marcapasos_implantes_protesis_cual,
    tiene_tatuajes,
    tatuajes_donde,
    lunares_cicatrices_manchas,
    lunares_cicatrices_manchas_donde,
    considera_piel_sensible,
    usa_protector_solar,
    primera_vez_depilacion_definitiva,
    depilacion_definitiva_donde_cuando,
    metodo_depilacion_anterior,
    metodo_depilacion_anterior_cual,
    embarazo_lactancia,
    problemas_cardiacos_hipertension,
    problemas_cardiacos_hipertension_cual,
    alergias,
    alergias_cual,
    metodo_anticonceptivo_hormonal,
    metodo_anticonceptivo_hormonal_cual,
  ]);
}

export async function getFichaSaludByDni(dni_usuario: string) {
    const result = await pool.query(`
      SELECT
        dni_usuario,
        enfermedad_diagnosticada,
        enfermedad_diagnosticada_cual,
        toma_medicacion,
        toma_medicacion_cual,
        antecedente_cancer,
        antecedente_cancer_cual,
        problemas_hormonales,
        problemas_hormonales_cual,
        enfermedad_piel,
        enfermedad_piel_cual,
        marcapasos_implantes_protesis,
        marcapasos_implantes_protesis_cual,
        tiene_tatuajes,
        tatuajes_donde,
        lunares_cicatrices_manchas,
        lunares_cicatrices_manchas_donde,
        considera_piel_sensible,
        usa_protector_solar,
        primera_vez_depilacion_definitiva,
        depilacion_definitiva_donde_cuando,
        metodo_depilacion_anterior,
        metodo_depilacion_anterior_cual,
        embarazo_lactancia,
        problemas_cardiacos_hipertension,
        problemas_cardiacos_hipertension_cual,
        alergias,
        alergias_cual,
        metodo_anticonceptivo_hormonal,
        metodo_anticonceptivo_hormonal_cual
      FROM ficha_salud
      WHERE dni_usuario = $1
      LIMIT 1;
    `, [dni_usuario]);
  
    return result.rows[0] || null;
  }

  export async function updateFichaSaludByDni(dni_usuario: string, data: any) {
    await pool.query(`
      UPDATE ficha_salud SET
        enfermedad_diagnosticada = $1,
        enfermedad_diagnosticada_cual = $2,
        toma_medicacion = $3,
        toma_medicacion_cual = $4,
        antecedente_cancer = $5,
        antecedente_cancer_cual = $6,
        problemas_hormonales = $7,
        problemas_hormonales_cual = $8,
        enfermedad_piel = $9,
        enfermedad_piel_cual = $10,
        marcapasos_implantes_protesis = $11,
        marcapasos_implantes_protesis_cual = $12,
        tiene_tatuajes = $13,
        tatuajes_donde = $14,
        lunares_cicatrices_manchas = $15,
        lunares_cicatrices_manchas_donde = $16,
        considera_piel_sensible = $17,
        usa_protector_solar = $18,
        primera_vez_depilacion_definitiva = $19,
        depilacion_definitiva_donde_cuando = $20,
        metodo_depilacion_anterior = $21,
        metodo_depilacion_anterior_cual = $22,
        embarazo_lactancia = $23,
        problemas_cardiacos_hipertension = $24,
        problemas_cardiacos_hipertension_cual = $25,
        alergias = $26,
        alergias_cual = $27,
        metodo_anticonceptivo_hormonal = $28,
        metodo_anticonceptivo_hormonal_cual = $29
      WHERE dni_usuario = $30
    `, [
      data.enfermedad_diagnosticada,
      data.enfermedad_diagnosticada_cual,
      data.toma_medicacion,
      data.toma_medicacion_cual,
      data.antecedente_cancer,
      data.antecedente_cancer_cual,
      data.problemas_hormonales,
      data.problemas_hormonales_cual,
      data.enfermedad_piel,
      data.enfermedad_piel_cual,
      data.marcapasos_implantes_protesis,
      data.marcapasos_implantes_protesis_cual,
      data.tiene_tatuajes,
      data.tatuajes_donde,
      data.lunares_cicatrices_manchas,
      data.lunares_cicatrices_manchas_donde,
      data.considera_piel_sensible,
      data.usa_protector_solar,
      data.primera_vez_depilacion_definitiva,
      data.depilacion_definitiva_donde_cuando,
      data.metodo_depilacion_anterior,
      data.metodo_depilacion_anterior_cual,
      data.embarazo_lactancia,
      data.problemas_cardiacos_hipertension,
      data.problemas_cardiacos_hipertension_cual,
      data.alergias,
      data.alergias_cual,
      data.metodo_anticonceptivo_hormonal,
      data.metodo_anticonceptivo_hormonal_cual,
      dni_usuario
    ]);
  }

  export async function deleteFichaSaludByDni(dni_usuario: string) {
    await pool.query(`
      DELETE FROM ficha_salud WHERE dni_usuario = $1
    `, [dni_usuario]);
  }