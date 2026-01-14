const pool = require("../config/db");

/* =========================
   GET ALL USERS (TEMPORARY)
========================= */
async function getUsers() {
  const result = await pool.query(`
    SELECT
      a.id,
      a.first_name,
      a.middle_name,
      a.last_name,
      a.email,
      a.status,
      COALESCE(r.role_name, 'UNASSIGNED') AS role,
      a.role_id,
      a.department_id,
      a.date_created
    FROM accounts a
    LEFT JOIN hris_roles r ON r.id = a.role_id
    ORDER BY a.date_created DESC
  `);

  return result.rows;
}
/* =========================
   UPDATE STATUS
========================= */
async function updateAccountStatus(userId, status) {
  const result = await pool.query(
    `
    UPDATE accounts
    SET status = $1
    WHERE id = $2
    RETURNING id, status
    `,
    [status, userId]
  );

  return result.rows[0];
}

/* =========================
   UPDATE ROLE
========================= */
async function updateUserRole(userId, roleId) {
  const result = await pool.query(
    `
    UPDATE accounts
    SET role_id = $1
    WHERE id = $2
    RETURNING id, role_id
    `,
    [roleId, userId]
  );

  return result.rows[0];
}

/* =========================
   UPDATE PASSWORD
========================= */
async function updateUserPassword(userId, hashedPassword) {
  const result = await pool.query(
    `
    UPDATE accounts
    SET password = $1
    WHERE id = $2
    RETURNING id
    `,
    [hashedPassword, userId]
  );

  return result.rows[0];
}

/* =========================
   DELETE ACCOUNT
========================= */
async function deleteAccount(userId) {
  const result = await pool.query(
    `
    DELETE FROM accounts
    WHERE id = $1
    RETURNING id
    `,
    [userId]
  );

  return result.rows[0];
}

/* ================================
   GET ACCOUNT BY ID (AUTH /ME)
================================ */
async function getAccountById(accountId) {
  const { rows } = await pool.query(
    `
    SELECT
      a.id,
      a.first_name,
      a.middle_name,
      a.last_name,
      a.email,
      a.status,
      a.department_id,
      a.role_id,
      COALESCE(r.role_name, 'UNASSIGNED') AS role
    FROM accounts a
    LEFT JOIN hris_roles r
      ON r.id = a.role_id
    WHERE a.id = $1
    `,
    [accountId]
  );

  return rows[0];
}

module.exports = {
  getUsers,
  updateAccountStatus,
  updateUserRole,
  updateUserPassword,
  deleteAccount,
  getAccountById,
};
