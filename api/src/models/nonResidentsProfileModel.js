// src/models/nonResidentsProfileModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

/* =========================
   LIST (PAGINATED + SEARCH)
========================= */
async function searchNonResidentsPage({ limit, offset, query, user }) {
  const params = [];
  let where = [];
  let i = 1;

  if (query) {
    where.push(`
      (
        CONCAT_WS(' ',
          nrp.first_name,
          nrp.middle_name,
          nrp.last_name,
          nrp.suffix
        ) ILIKE $${i}
        OR nrp.contact_number ILIKE $${i}
      )
    `);
    params.push(`%${query}%`);
    i++;
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  // 🔹 DATA QUERY
  const dataSql = `
    SELECT
      nrp.id,
      nrp.first_name,
      nrp.middle_name,
      nrp.last_name,
      nrp.suffix,
      nrp.prefix,
      nrp.birthdate,
      nrp.gender,
      nrp.civil_status,
      nrp.contact_number,
      nrp.alagang_valmocina_id,
      nrp.img_url,
      nrp.img_mime,
      gr.region            AS gis_region_name,
      gp.province_name     AS gis_province_name,
      gm.municipality_name AS gis_municipality_name,
      gb.barangay_name,
      nrp.street_address_line,
      TRUE AS is_non_resident,
      TRIM(
        CONCAT_WS(', ',
          nrp.street_address_line,
          gb.barangay_name,
          gm.municipality_name,
          gp.province_name,
          gr.region
        )
      ) AS complete_address
    FROM non_residents_profile nrp
    LEFT JOIN gis_regions gr ON nrp.gis_region_id = gr.id
    LEFT JOIN gis_province gp ON nrp.gis_province_id = gp.id
    LEFT JOIN gis_municipality gm ON nrp.gis_municipality_id = gm.id
    LEFT JOIN gis_barangay gb ON nrp.gis_barangay_id = gb.id
    ${whereClause}
    ORDER BY nrp.date_created DESC
    LIMIT $${i} OFFSET $${i + 1};
  `;

  // 🔹 COUNT QUERY
  const countSql = `
    SELECT COUNT(*)::int AS total
    FROM non_residents_profile nrp
    ${whereClause};
  `;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataSql, [...params, limit, offset]),
    pool.query(countSql, params),
  ]);

  return {
    rows: dataResult.rows,
    total: countResult.rows[0].total,
  };
}

/* =========================
   SINGLE (FOR EDIT MODAL)
========================= */
async function getNonResidentById(id) {
  const result = await pool.query(
    `
    SELECT
    nrp.*,
    TRUE AS is_non_resident,

      gr.region            AS gis_region_name,
      gp.province_name     AS gis_province_name,
      gm.municipality_name AS gis_municipality_name,
      gb.barangay_name     AS gis_barangay_name -- ✅ ADD

    FROM non_residents_profile nrp
    LEFT JOIN gis_regions gr       ON nrp.gis_region_id = gr.id
    LEFT JOIN gis_province gp      ON nrp.gis_province_id = gp.id
    LEFT JOIN gis_municipality gm  ON nrp.gis_municipality_id = gm.id
    LEFT JOIN gis_barangay gb      ON nrp.gis_barangay_id = gb.id
    WHERE nrp.id = $1;
    `,
    [id]
  );

  return result.rows[0];
}

async function getNonResidentsProfileByIdRaw(id) {
  const result = await pool.query(
    "SELECT * FROM non_residents_profile WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

/* =========================
   IDS (MANY) - LIKE RESIDENT
========================= */
async function getNonResidentIdsByNonResidentId(nonResidentId) {
  const result = await pool.query(
    `
    SELECT
      nri.id,
      nri.id_number,
      nri.hris_id_types_id,
      hit.id_type
    FROM non_residents_id nri
    JOIN hris_id_types hit
      ON nri.hris_id_types_id = hit.id
    WHERE nri.non_residents_profile_id = $1
    ORDER BY
      CASE
        WHEN hit.id_type = 'PhilHealth ID' THEN 1
        WHEN hit.id_type = 'Quezon City ID' THEN 2
        ELSE 3
      END,
      nri.id ASC;
    `,
    [nonResidentId]
  );

  return result.rows;
}

async function createNonResidentIds(
  nonResidentId,
  idCards = [],
  client = pool
) {
  if (!idCards.length) return [];

  const values = [];
  const placeholders = idCards.map((card, index) => {
    const baseIndex = index * 3;
    values.push(card.idNumber, nonResidentId, card.idTypeId);
    return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`;
  });

  const query = `
    INSERT INTO non_residents_id (
      id_number,
      non_residents_profile_id,
      hris_id_types_id
    )
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;

  const result = await client.query(query, values);
  return result.rows;
}

async function replaceNonResidentIds(
  nonResidentId,
  idCards = [],
  client = pool
) {
  await client.query(
    "DELETE FROM non_residents_id WHERE non_residents_profile_id = $1",
    [nonResidentId]
  );

  if (!idCards.length) return [];
  return createNonResidentIds(nonResidentId, idCards, client);
}

/* =========================
   CREATE / UPDATE PROFILE
========================= */
async function createNonResidentsProfile(data, createdBy, client = pool) {
  const {
    first_name,
    middle_name,
    last_name,
    suffix,
    prefix,

    nationality,
    birthdate,
    gender,
    civil_status,
    blood_type,

    is_voter,
    is_pwd,
    is_employed,
    is_student,

    precint_number,
    email_address,
    contact_number,
    emergency_contact_full_name,
    emergency_contact_number,

    alagang_valmocina_id,

    gis_region_id,
    gis_province_id,
    gis_municipality_id,
    gis_barangay_id,

    street_address_line,
  } = data;

  const result = await client.query(
    `
    INSERT INTO non_residents_profile (
      first_name,
      middle_name,
      last_name,
      suffix,
      prefix,

      nationality,
      birthdate,
      gender,
      civil_status,
      blood_type,

      is_voter,
      is_pwd,
      is_employed,
      is_student,

      precint_number,
      email_address,
      contact_number,
      emergency_contact_full_name,
      emergency_contact_number,

      alagang_valmocina_id,

      gis_region_id,
      gis_province_id,
      gis_municipality_id,
      gis_barangay_id,

      street_address_line,

      created_by
    )
    VALUES (
      $1,  $2,  $3,  $4,  $5,
      $6,  $7,  $8,  $9,  $10,
      $11, $12, $13, $14,
      $15, $16, $17, $18, $19,
      $20,
      $21, $22, $23,
      $24,
      $25,
      $26
    )
    RETURNING *;
    `,
    [
      first_name,
      middle_name,
      last_name,
      suffix || null,
      prefix || null,

      nationality,
      birthdate,
      gender,
      civil_status,
      blood_type || null,

      normalizeBoolean(is_voter),
      normalizeBoolean(is_pwd),
      normalizeBoolean(is_employed),
      normalizeBoolean(is_student),

      precint_number || null,
      email_address || null,
      contact_number || null,
      emergency_contact_full_name || null,
      emergency_contact_number || null,

      alagang_valmocina_id,

      gis_region_id,
      gis_province_id,
      gis_municipality_id,
      gis_barangay_id,

      street_address_line || null,

      createdBy,
    ]
  );

  return result.rows[0];
}

async function updateNonResidentsProfile(id, data, updatedBy, client = pool) {
  const {
    first_name,
    middle_name,
    last_name,
    suffix,
    prefix,

    nationality,
    birthdate,
    gender,
    civil_status,
    blood_type,

    is_voter,
    is_pwd,
    is_employed,
    is_student,

    precint_number,
    email_address,
    contact_number,
    emergency_contact_full_name,
    emergency_contact_number,

    alagang_valmocina_id,

    gis_region_id,
    gis_province_id,
    gis_municipality_id,
    gis_barangay_id,

    street_address_line,
  } = data;

  const result = await client.query(
    `
    UPDATE non_residents_profile
    SET
      first_name                  = $1,
      middle_name                 = $2,
      last_name                   = $3,
      suffix                      = $4,
      prefix                      = $5,

      nationality                 = $6,
      birthdate                   = $7,
      gender                      = $8,
      civil_status                = $9,
      blood_type                  = $10,

      is_voter                    = $11,
      is_pwd                      = $12,
      is_employed                 = $13,
      is_student                  = $14,

      precint_number              = $15,
      email_address               = $16,
      contact_number              = $17,
      emergency_contact_full_name = $18,
      emergency_contact_number    = $19,

      alagang_valmocina_id        = $20,

      gis_region_id               = $21,
      gis_province_id             = $22,
      gis_municipality_id         = $23,
      gis_barangay_id             = $24,

      street_address_line         = $25,

      updated_by                  = $26,
      updated_at                  = NOW()
    WHERE id = $27
    RETURNING *;
    `,
    [
      first_name,
      middle_name,
      last_name,
      suffix || null,
      prefix || null,

      nationality,
      birthdate,
      gender,
      civil_status,
      blood_type || null,

      normalizeBoolean(is_voter),
      normalizeBoolean(is_pwd),
      normalizeBoolean(is_employed),
      normalizeBoolean(is_student),

      precint_number || null,
      email_address || null,
      contact_number || null,
      emergency_contact_full_name || null,
      emergency_contact_number || null,

      alagang_valmocina_id,

      gis_region_id,
      gis_province_id,
      gis_municipality_id,
      gis_barangay_id,

      street_address_line || null,

      updatedBy,
      id,
    ]
  );

  return result.rows[0];
}

/* =========================
   PHOTO SAVE
========================= */
async function saveNonResidentPhoto(id, { img_url, img_mime }) {
  const result = await pool.query(
    `
    UPDATE non_residents_profile
    SET img_url = $1,
        img_mime = $2,
        updated_at = NOW()
    WHERE id = $3
    RETURNING *;
    `,
    [img_url, img_mime, id]
  );
  return result.rows[0];
}

module.exports = {
  searchNonResidentsPage,
  getNonResidentById,
  getNonResidentsProfileByIdRaw,

  getNonResidentIdsByNonResidentId,
  createNonResidentIds,
  replaceNonResidentIds,

  createNonResidentsProfile,
  updateNonResidentsProfile,

  saveNonResidentPhoto,
};
