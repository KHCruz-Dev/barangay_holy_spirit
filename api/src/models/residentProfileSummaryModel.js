const pool = require("../config/db");

// =========================
// ADMIN SUMMARY
// =========================
async function getAdminSummary() {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM residents_profile WHERE status = 'Active') AS total_residents,
      (SELECT COUNT(*) FROM non_residents_profile WHERE status = 'Active') AS total_non_residents,
      (SELECT COUNT(*) FROM residents_profile WHERE is_voter = TRUE AND status = 'Active') AS voters,
      (SELECT COUNT(*) FROM residents_profile WHERE is_voter = FALSE AND status = 'Active') AS non_voters
  `);

  return result.rows[0];
}

// =========================
// STAFF SUMMARY (ENCODER / COORDINATOR / REGISTRATION)
// =========================
async function getStaffSummary(userId) {
  const result = await pool.query(
    `
    SELECT
      (SELECT COUNT(*) FROM residents_profile WHERE created_by = $1) AS encoded_residents,
      (SELECT COUNT(*) FROM non_residents_profile WHERE created_by = $1) AS encoded_non_residents,
      (SELECT COUNT(*) FROM residents_profile
        WHERE created_by = $1
        AND DATE(date_created) = CURRENT_DATE
      ) AS encoded_today,
      (SELECT COUNT(*) FROM residents_profile WHERE created_by = $1) AS encoded_total
    `,
    [userId]
  );

  return result.rows[0];
}

// =========================
// ID PRINTER SUMMARY
// =========================
async function getIdPrinterSummary() {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total_residents
    FROM residents_profile
    WHERE status = 'Active';
  `);

  return result.rows[0];
}

module.exports = {
  getAdminSummary,
  getStaffSummary,
  getIdPrinterSummary,
};
