// src/controllers/authController.js
const {
  createAccount,
  getAccountByEmail,
  getAccountForLogin,
  getAccountById,
} = require("../models/accountModel");
const { getCookieOptions } = require("../config/cookieOptions");

const bcrypt = require("bcrypt");
const { signToken } = require("../utils/jwt");

/* ================================
   REGISTER ACCOUNT
================================ */
async function registerAccount(req, res) {
  try {
    const {
      firstName,
      middleName,
      lastName,
      prefix,
      suffix,
      contact,
      email,
      password,
      confirmPassword,
    } = req.body;

    /* ===== REQUIRED FIELDS ===== */
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "First name, last name, and email are required.",
      });
    }

    if (!contact || contact.length !== 10) {
      return res.status(400).json({
        message: "Contact number must be exactly 10 digits.",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Password fields are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    /* ===== DUPLICATE EMAIL CHECK ===== */
    const existing = await getAccountByEmail(email.toLowerCase());
    if (existing) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    /* ===== CREATE ACCOUNT ===== */
    const account = await createAccount({
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      prefix,
      suffix,
      contact_number: `+63${contact}`,
      email: email.toLowerCase(),
      password,
    });

    return res.status(201).json({
      message: "Registration successful. Account pending admin approval.",
      account,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/* ================================
   LOGIN
================================ */
async function loginAccount(req, res) {
  try {
    const { email, password } = req.body;

    /* ===== BASIC VALIDATION ===== */
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    /* ===== FIND ACCOUNT ===== */
    const account = await getAccountForLogin(email.toLowerCase());

    if (!account) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    /* ===== CHECK PASSWORD ===== */
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    /* ===== CHECK STATUS ===== */
    if (account.status !== "Active") {
      return res.status(403).json({
        message:
          "Your account is pending approval. Please contact the administrator.",
      });
    }

    /* ===== SUCCESS ===== */
    const token = signToken({
      sub: account.id,
      role: account.role_name,
      department_id: account.department_id,
    });

    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: account.id,
        email: account.email,
        first_name: account.first_name,
        middle_name: account.middle_name || null,
        last_name: account.last_name,
        role: account.role_name,
        role_key: account.role_name,
        department_id: account.department_id,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

function logoutAccount(req, res) {
  res.clearCookie("token", getCookieOptions());
  res.json({ message: "Logged out" });
}

// ================================
// GET AUTHENTICATED USER
// ================================
async function getAuthenticatedUser(req, res) {
  try {
    const userId = req.user.sub; // from JWT

    const account = await getAccountById(userId);

    if (!account) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    return res.json({
      user: {
        id: account.id,
        email: account.email,
        first_name: account.first_name,
        middle_name: account.middle_name,
        last_name: account.last_name,
        role: account.role_name,
        department_id: account.department_id,
      },
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch authenticated user",
    });
  }
}

module.exports = {
  registerAccount,
  loginAccount,
  logoutAccount,
  getAuthenticatedUser,
};
