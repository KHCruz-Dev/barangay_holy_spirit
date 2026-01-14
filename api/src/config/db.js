// src/config/db.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon usually needs SSL; keep this for dev/staging
  },
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL (Neon)");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL connection error:", err);
});

module.exports = pool;
