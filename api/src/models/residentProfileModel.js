// src/models/residentProfileModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all residents profile with GIS names (full, no pagination)
async function getAllResidentsProfile() {
  const result = await pool.query(`
    SELECT
      rp.id,
      rp.first_name,
      rp.middle_name,
      rp.last_name,
      rp.suffix,
      rp.prefix,
      rp.birthdate,
      rp.gender,
      rp.civil_status,
      rp.contact_number,
      rp.alagang_valmocina_id,
      rp.is_id_printed,

      -- GIS names
      gr.region                AS gis_region_name,
      gp.province_name         AS gis_province_name,
      gm.municipality_name     AS gis_municipality_name,
      gb.barangay_name         AS gis_barangay_name,
      gs.subdivision_name      AS gis_subdivision_name,
      gst.street_name          AS gis_street_name,

      -- ✅ FULL ADDRESS
      TRIM(
        CONCAT_WS(', ',
          CONCAT_WS(' ',
            rp.gis_street_number,
            gst.street_name
          ),
          gs.subdivision_name,
          gb.barangay_name,
          gm.municipality_name,
          gp.province_name,
          gr.region
        )
      ) AS complete_address,

      rp.img_url,
      rp.img_mime,
      rp.date_created

    FROM residents_profile rp
    LEFT JOIN gis_regions       gr  ON rp.gis_region_id       = gr.id
    LEFT JOIN gis_province      gp  ON rp.gis_province_id     = gp.id
    LEFT JOIN gis_municipality  gm  ON rp.gis_municipality_id = gm.id
    LEFT JOIN gis_barangay      gb  ON rp.gis_barangay_id     = gb.id
    LEFT JOIN gis_subdivision   gs  ON rp.gis_subdivision_id  = gs.id
    LEFT JOIN gis_streets       gst ON rp.gis_streets_id      = gst.id

    ORDER BY rp.date_created DESC;
  `);

  return result.rows;
}

// Paginated subset for grid (light overview)
async function getResidentsPage(limit, offset) {
  const result = await pool.query(
    `
    SELECT
      rp.id,
      rp.first_name,
      rp.middle_name,
      rp.last_name,
      rp.suffix,
      rp.prefix,
      rp.birthdate,
      rp.gender,
      rp.civil_status,
      rp.contact_number,
      rp.is_id_printed,
      rp.alagang_valmocina_id,
      rp.alagang_valmocina_id_status,

      -- 📸 image
      rp.img_url,
      rp.img_mime,

      -- GIS NAMES (CORRECT)
      gr.region                AS gis_region_name,
      gp.province_name         AS gis_province_name,
      gm.municipality_name     AS gis_municipality_name,
      gb.barangay_name         AS gis_barangay_name,
      gs.subdivision_name      AS gis_subdivision_name,
      gst.street_name          AS gis_street_name,

      -- ✅ FULL ADDRESS (CORRECT)
      TRIM(
        CONCAT_WS(', ',
          CONCAT_WS(' ',
            rp.gis_street_number,
            gst.street_name
          ),
          gs.subdivision_name,
          gb.barangay_name,
          gm.municipality_name,
          gp.province_name,
          gr.region
        )
      ) AS complete_address,

      rp.date_created

    FROM residents_profile rp
    LEFT JOIN gis_regions       gr  ON rp.gis_region_id       = gr.id
    LEFT JOIN gis_province      gp  ON rp.gis_province_id     = gp.id
    LEFT JOIN gis_municipality  gm  ON rp.gis_municipality_id = gm.id
    LEFT JOIN gis_barangay      gb  ON rp.gis_barangay_id     = gb.id
    LEFT JOIN gis_subdivision   gs  ON rp.gis_subdivision_id  = gs.id
    LEFT JOIN gis_streets       gst ON rp.gis_streets_id      = gst.id

    ORDER BY rp.date_created DESC
    LIMIT $1 OFFSET $2;
    `,
    [limit, offset],
  );

  return result.rows;
}

// Single resident with GIS names (for view/edit modal)
async function getResidentById(id) {
  const result = await pool.query(
    `
    SELECT
    rp.*,
    
      rp.alagang_valmocina_id_status,
      rp.gis_streets_id,          -- ✅ ADD THIS
      rp.gis_street_number,       -- already exists

      gr.region                AS gis_region_name,
      gp.province_name         AS gis_province_name,
      gm.municipality_name     AS gis_municipality_name,
      gb.barangay_name         AS gis_barangay_name,
      gs.subdivision_name      AS gis_subdivision_name,
      gst.street_name          AS gis_street_name,

    TRIM(
    CONCAT_WS(', ',
      CONCAT_WS(' ',
        rp.gis_street_number,
        gst.street_name
      ),
      gs.subdivision_name,
      gb.barangay_name,
      gm.municipality_name,
      gp.province_name,
      gr.region
    )
  ) AS complete_address

    FROM residents_profile rp
    LEFT JOIN gis_regions       gr  ON rp.gis_region_id       = gr.id
    LEFT JOIN gis_province      gp  ON rp.gis_province_id     = gp.id
    LEFT JOIN gis_municipality  gm  ON rp.gis_municipality_id = gm.id
    LEFT JOIN gis_barangay      gb  ON rp.gis_barangay_id     = gb.id
    LEFT JOIN gis_subdivision   gs  ON rp.gis_subdivision_id  = gs.id
    LEFT JOIN gis_streets       gst ON rp.gis_streets_id      = gst.id
    WHERE rp.id = $1;
    `,
    [id],
  );

  return result.rows[0];
}

async function getResidentIdsByResidentId(residentId) {
  const result = await pool.query(
    `
    SELECT
      ri.id,
      ri.id_number,
      ri.hris_id_types_id,
      hit.id_type
    FROM resident_id ri
    JOIN hris_id_types hit
      ON ri.hris_id_types_id = hit.id
    WHERE ri.residents_profile_id = $1
    ORDER BY
      CASE
        WHEN hit.id_type = 'PhilHealth ID' THEN 1
        WHEN hit.id_type = 'Quezon City ID' THEN 2
        ELSE 3
      END,
      ri.id ASC;
    `,
    [residentId],
  );

  return result.rows;
}

// Raw version (no joins) – still used by some flows
async function getResidentsProfileById(id) {
  const result = await pool.query(
    "SELECT * FROM residents_profile WHERE id = $1",
    [id],
  );
  return result.rows[0];
}

// Create a new residents profile (transaction-safe)
async function createResidentsProfile(data, createdBy, client = pool) {
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
    is_id_printed,
    gis_region_id,
    gis_province_id,
    gis_municipality_id,
    gis_barangay_id,
    gis_subdivision_id,
    gis_streets_id,
    gis_street_number,
  } = data;

  const result = await client.query(
    `
    INSERT INTO residents_profile (
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
    is_id_printed,
    gis_region_id,
    gis_province_id,
    gis_municipality_id,
    gis_barangay_id,
    gis_subdivision_id,
    gis_streets_id,
    gis_street_number,
    created_by
  )
  VALUES (
    $1,  $2,  $3,  $4,  $5,
    $6,  $7,  $8,  $9,  $10,
    $11, $12, $13, $14, $15,
    $16, $17, $18, $19, $20,
    $21, $22, $23, $24, $25,
    $26, $27, $28, $29
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
      normalizeBoolean(is_id_printed),
      gis_region_id,
      gis_province_id,
      gis_municipality_id,
      gis_barangay_id,
      gis_subdivision_id,
      gis_streets_id,
      gis_street_number,
      createdBy, // 🔥 FROM JWT
    ],
  );

  return result.rows[0];
}

// Insert to resident's ID Table
async function createResidentIds(residentId, idCards = [], client = pool) {
  if (!idCards.length) return [];

  const values = [];
  const placeholders = idCards.map((card, index) => {
    const baseIndex = index * 3;
    values.push(card.idNumber, residentId, card.idTypeId);
    return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`;
  });

  const query = `
    INSERT INTO resident_id (
      id_number,
      residents_profile_id,
      hris_id_types_id
    )
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;

  const result = await client.query(query, values);
  return result.rows;
}

// replace residents id on update
async function replaceResidentIds(residentId, idCards = [], client = pool) {
  await client.query(
    "DELETE FROM resident_id WHERE residents_profile_id = $1",
    [residentId],
  );

  if (!idCards.length) return [];

  return createResidentIds(residentId, idCards, client);
}

// Update residents profile
async function updateResidentsProfile(id, data, updatedBy, client = pool) {
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
    is_id_printed,
    gis_region_id,
    gis_province_id,
    gis_municipality_id,
    gis_barangay_id,
    gis_subdivision_id,
    gis_streets_id,
    gis_street_number,
  } = data;

  const result = await client.query(
    `
    UPDATE residents_profile
    SET
      first_name                   = $1,
      middle_name                  = $2,
      last_name                    = $3,
      suffix                       = $4,
      prefix                       = $5,
      nationality                  = $6,
      birthdate                    = $7,
      gender                       = $8,
      civil_status                 = $9,
      blood_type                   = $10,
      is_voter                     = $11,
      is_pwd                       = $12,
      is_employed                  = $13,
      is_student                   = $14,
      precint_number               = $15,
      email_address                = $16,
      contact_number               = $17,
      emergency_contact_full_name  = $18,
      emergency_contact_number     = $19,
      alagang_valmocina_id         = $20,
      is_id_printed                = $21,
      gis_region_id                = $22,
      gis_province_id              = $23,
      gis_municipality_id          = $24,
      gis_barangay_id              = $25,
      gis_subdivision_id           = $26,
      gis_streets_id               = $27,
      gis_street_number            = $28,
      updated_by                   = $29,
      updated_at                   = NOW()
    WHERE id = $30
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
      normalizeBoolean(is_id_printed),
      gis_region_id,
      gis_province_id,
      gis_municipality_id,
      gis_barangay_id,
      gis_subdivision_id,
      gis_streets_id,
      gis_street_number,

      updatedBy, // ✅ from controller
      id,
    ],
  );

  return result.rows[0];
}

async function saveResidentPhoto(id, { img_url, img_mime }) {
  const result = await pool.query(
    `
    UPDATE residents_profile
    SET img_url = $1,
        img_mime = $2,
        updated_at = NOW()
    WHERE id = $3
    RETURNING *;
    `,
    [img_url, img_mime, id],
  );

  return result.rows[0];
}

// Disable residents profile
async function disableResidentsProfile(id) {
  const result = await pool.query(
    `
    UPDATE residents_profile
    SET status = 'Disabled',
        updated_at = NOW()
    WHERE id = $1
    RETURNING *;
    `,
    [id],
  );

  return result.rows[0];
}

// Delete resident profile
async function deleteResidentsProfile(id) {
  const result = await pool.query(
    "DELETE FROM residents_profile WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
}

async function getResidentsPageByRole(limit, offset, user) {
  let query = `
    SELECT
      rp.id,
      rp.first_name,
      rp.middle_name,
      rp.last_name,
      rp.suffix,
      rp.prefix,
      rp.birthdate,
      rp.gender,
      rp.civil_status,
      rp.contact_number,
      rp.is_id_printed,
      rp.alagang_valmocina_id,

      rp.img_url,
      rp.img_mime,

      gr.region                AS gis_region_name,
      gp.province_name         AS gis_province_name,
      gm.municipality_name     AS gis_municipality_name,
      gb.barangay_name         AS gis_barangay_name,
      gs.subdivision_name      AS gis_subdivision_name,
      gst.street_name          AS gis_street_name,

      TRIM(
        CONCAT_WS(', ',
          CONCAT_WS(' ',
            rp.gis_street_number,
            gst.street_name
          ),
          gs.subdivision_name,
          gb.barangay_name,
          gm.municipality_name,
          gp.province_name,
          gr.region
        )
      ) AS complete_address,

      rp.date_created
    FROM residents_profile rp
    LEFT JOIN gis_regions       gr  ON rp.gis_region_id       = gr.id
    LEFT JOIN gis_province      gp  ON rp.gis_province_id     = gp.id
    LEFT JOIN gis_municipality  gm  ON rp.gis_municipality_id = gm.id
    LEFT JOIN gis_barangay      gb  ON rp.gis_barangay_id     = gb.id
    LEFT JOIN gis_subdivision   gs  ON rp.gis_subdivision_id  = gs.id
    LEFT JOIN gis_streets       gst ON rp.gis_streets_id      = gst.id
  `;

  const params = [];

  if (user.role === "COORDINATOR") {
    query += ` WHERE rp.created_by = $1`;
    params.push(user.sub);
  }

  query += `
    ORDER BY rp.date_created DESC
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2};
  `;

  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
}

async function getAllResidentsProfileByRole(user) {
  let query = `
    SELECT *
    FROM residents_profile rp
  `;

  const params = [];

  if (user.role === "COORDINATOR") {
    query += ` WHERE rp.created_by = $1`;
    params.push(user.sub);
  }

  query += ` ORDER BY rp.date_created DESC`;

  const result = await pool.query(query, params);
  return result.rows;
}

async function searchResidentsPage({
  limit,
  offset,
  query,
  idStatus,
  barangayId,
  user,
}) {
  const params = [];
  let where = [];
  let i = 1;

  const COORDINATOR_ROLE_ID = "d692b1e2-94a5-4f7e-944e-df47d460deaf";

  // 🔒 ROLE-BASED OWNERSHIP (ALWAYS APPLIED)
  if (user.role_id === COORDINATOR_ROLE_ID) {
    where.push(`rp.created_by = $${i}`);
    params.push(user.sub);
    i++;
  }

  // 🟡 ID STATUS FILTER (SERVER-SIDE)
  if (idStatus) {
    where.push(`rp.alagang_valmocina_id_status = $${i}`);
    params.push(idStatus);
    i++;
  }

  if (barangayId) {
    where.push(`rp.gis_barangay_id = $${i}`);
    params.push(barangayId);
    i++;
  }

  // 🔍 SEARCH FILTER
  if (query) {
    where.push(`
      (
        CONCAT_WS(' ',
          rp.first_name,
          rp.middle_name,
          rp.last_name,
          rp.suffix
        ) ILIKE $${i}
        OR rp.alagang_valmocina_id ILIKE $${i}
        OR rp.contact_number ILIKE $${i}
      )
    `);
    params.push(`%${query}%`);
    i++;
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  // 🔢 COUNT (USED FOR PAGINATION)
  const countSql = `
    SELECT COUNT(*)::int AS total
    FROM residents_profile rp
    ${whereClause};
  `;

  const countResult = await pool.query(countSql, params);
  const total = countResult.rows[0].total;

  // 📄 DATA QUERY
  const dataSql = `
    SELECT
      rp.id,
      rp.first_name,
      rp.middle_name,
      rp.last_name,
      rp.suffix,
      rp.prefix,
      rp.birthdate,
      rp.gender,
      rp.civil_status,
      rp.contact_number,
      rp.is_id_printed,
      rp.alagang_valmocina_id,
      rp.alagang_valmocina_id_status,

      rp.img_url,
      rp.img_mime,

      gr.region                AS gis_region_name,
      gp.province_name         AS gis_province_name,
      gm.municipality_name     AS gis_municipality_name,
      gb.barangay_name         AS gis_barangay_name,
      gs.subdivision_name      AS gis_subdivision_name,
      gst.street_name          AS gis_street_name,

      rp.gis_street_number,

      TRIM(
        CONCAT_WS(', ',
          CONCAT_WS(' ',
            rp.gis_street_number,
            gst.street_name
          ),
          gs.subdivision_name,
          gb.barangay_name,
          gm.municipality_name,
          gp.province_name,
          gr.region
        )
      ) AS complete_address,

      rp.date_created
    FROM residents_profile rp
    LEFT JOIN gis_regions       gr  ON rp.gis_region_id       = gr.id
    LEFT JOIN gis_province      gp  ON rp.gis_province_id     = gp.id
    LEFT JOIN gis_municipality  gm  ON rp.gis_municipality_id = gm.id
    LEFT JOIN gis_barangay      gb  ON rp.gis_barangay_id     = gb.id
    LEFT JOIN gis_subdivision   gs  ON rp.gis_subdivision_id  = gs.id
    LEFT JOIN gis_streets       gst ON rp.gis_streets_id      = gst.id
    ${whereClause}
    ORDER BY rp.date_created DESC
    LIMIT $${i} OFFSET $${i + 1};
  `;

  const dataParams = [...params, limit, offset];
  const dataResult = await pool.query(dataSql, dataParams);

  return {
    rows: dataResult.rows,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// Update Alagang Valmocina ID Status
async function updateResidentIdStatus(id, status, updatedBy) {
  const result = await pool.query(
    `
    UPDATE residents_profile
    SET alagang_valmocina_id_status = $1,
        updated_by = $2,
        updated_at = NOW()
    WHERE id = $3
    RETURNING *;
    `,
    [status, updatedBy, id],
  );

  return result.rows[0];
}

// Bulk update Alagang Valmocina ID Status
async function bulkUpdateResidentIdStatus(ids, status, updatedBy) {
  const result = await pool.query(
    `
    UPDATE residents_profile
    SET alagang_valmocina_id_status = $1,
        updated_by = $2,
        updated_at = NOW()
    WHERE id = ANY($3::uuid[])
    RETURNING id;
    `,
    [status, updatedBy, ids],
  );

  return result.rows;
}

// Get GLOBAL counts of Alagang Valmocina ID statuses
async function getResidentIdStatusCounts() {
  const result = await pool.query(`
    SELECT
      alagang_valmocina_id_status AS status,
      COUNT(*)::int AS total
    FROM residents_profile
    WHERE alagang_valmocina_id_status IS NOT NULL
    GROUP BY alagang_valmocina_id_status;
  `);

  // Convert rows → object map
  return result.rows.reduce((acc, row) => {
    acc[row.status] = row.total;
    return acc;
  }, {});
}

// ✅ BULK FETCH RESIDENTS FOR ID GENERATION
async function getResidentsByIds(ids) {
  const result = await pool.query(
    `
    SELECT
      rp.id,
      rp.first_name,
      rp.middle_name,
      rp.last_name,
      rp.suffix,
      rp.birthdate,
      rp.contact_number,
      rp.alagang_valmocina_id,

      rp.img_url,
      rp.img_mime,

      rp.emergency_contact_full_name,
      rp.emergency_contact_number,

      -- GIS ADDRESS
      gr.region                AS "region",
      gp.province_name         AS "province",
      gm.municipality_name     AS "cityMunicipality",
      gb.barangay_name         AS "barangay",
      gs.subdivision_name      AS "subdivisionVillage",
      gst.street_name          AS "streetRoad",
      rp.gis_street_number     AS "streetNumber"

    FROM residents_profile rp
    LEFT JOIN gis_regions gr        ON gr.id = rp.gis_region_id
    LEFT JOIN gis_province gp       ON gp.id = rp.gis_province_id
    LEFT JOIN gis_municipality gm   ON gm.id = rp.gis_municipality_id
    LEFT JOIN gis_barangay gb       ON gb.id = rp.gis_barangay_id
    LEFT JOIN gis_subdivision gs    ON gs.id = rp.gis_subdivision_id
    LEFT JOIN gis_streets gst       ON gst.id = rp.gis_streets_id

    WHERE rp.id = ANY($1::uuid[])
    ORDER BY rp.last_name ASC
    `,
    [ids],
  );

  return result.rows;
}

module.exports = {
  getAllResidentsProfile,
  getResidentsPage,
  getResidentById,
  getResidentsProfileById,
  createResidentsProfile,
  updateResidentsProfile,
  disableResidentsProfile,
  deleteResidentsProfile,
  saveResidentPhoto,
  createResidentIds,
  replaceResidentIds,
  getResidentIdsByResidentId,
  getResidentsPageByRole,
  getAllResidentsProfileByRole,
  searchResidentsPage,
  updateResidentIdStatus,
  bulkUpdateResidentIdStatus,
  getResidentIdStatusCounts,
  getResidentsByIds,
};
