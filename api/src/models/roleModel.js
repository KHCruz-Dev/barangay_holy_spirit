const pool = require("../config/db");

async function getRoleIdByName(roleName) {
  const result = await pool.query(
    `
    SELECT id
    FROM hris_roles
    WHERE role_name = $1
      AND status = 'Active'
    LIMIT 1
    `,
    [roleName]
  );

  return result.rows[0]?.id;
}

module.exports = {
  getRoleIdByName,
};
