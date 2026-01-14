// src/models/accountModel.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");

const HEALTH_AND_WELLNESS_DEPARTMENT_ID =
  "5f01ad8e-35c2-485c-934c-3f51227290ba";

/* ================================
   CHECK EMAIL
================================ */
async function getAccountByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id FROM accounts WHERE email = $1`,
    [email]
  );
  return rows[0];
}

/* ================================
   CREATE ACCOUNT
================================ */
async function createAccount(data) {
  const {
    first_name,
    middle_name,
    last_name,
    prefix,
    suffix,
    contact_number,
    email,
    password,
  } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `
    INSERT INTO accounts (
      first_name,
      middle_name,
      last_name,
      prefix,
      suffix,
      contact_number,
      email,
      password,
      department_id,
      role_id,
      status
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8,
      $9, NULL, 'Pending'
    )
    RETURNING
      id,
      email,
      status,
      date_created;
    `,
    [
      first_name,
      middle_name || null,
      last_name,
      prefix || null,
      suffix || null,
      contact_number,
      email,
      hashedPassword,
      HEALTH_AND_WELLNESS_DEPARTMENT_ID,
    ]
  );

  return rows[0];
}

/* ================================
   GET ACCOUNT FOR LOGIN
================================ */
// src/models/accountModel.js

async function getAccountForLogin(email) {
  const { rows } = await pool.query(
    `
    SELECT
      a.id,
      a.first_name,
      a.middle_name,
      a.last_name,
      a.email,
      a.password,
      a.status,
      a.department_id,
      a.role_id,
      r.role_name
    FROM accounts a
    LEFT JOIN hris_roles r
      ON r.id = a.role_id
    WHERE a.email = $1
    `,
    [email]
  );

  return rows[0];
}

async function getAccountById(id) {
  const { rows } = await pool.query(
    `
    SELECT
      a.id,
      a.first_name,
      a.middle_name,
      a.last_name,
      a.email,
      r.role_name,
      a.department_id
    FROM accounts a
    LEFT JOIN hris_roles r ON r.id = a.role_id
    WHERE a.id = $1
    `,
    [id]
  );

  return rows[0];
}

module.exports = {
  createAccount,
  getAccountByEmail,
  getAccountForLogin,
  getAccountById,
};
