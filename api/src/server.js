// src/server.js
const dotenv = require("dotenv");
const path = require("path");

// Load correct .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === "staging" ? ".env.staging" : ".env";

dotenv.config({ path: path.join(__dirname, "..", envFile) });

const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV})`);
});
