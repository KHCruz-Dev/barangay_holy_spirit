// src/controllers/nonResidentsProfileController.js
const pool = require("../config/db");

const {
  searchNonResidentsPage,
  getNonResidentById,
  getNonResidentsProfileByIdRaw,

  getNonResidentIdsByNonResidentId,
  createNonResidentsProfile,
  updateNonResidentsProfile,

  createNonResidentIds,
  replaceNonResidentIds,
} = require("../models/nonResidentsProfileModel");

// GET /api/nonResidentsProfile?page=&limit=&search=
async function getNonResidentsPageHandler(req, res) {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 20);
    const offset = (page - 1) * limit;
    const query = req.query.search?.trim() || "";

    const { rows, total } = await searchNonResidentsPage({
      limit,
      offset,
      query,
      user: req.user,
    });

    res.json({
      rows,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Non-residents fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/nonResidentsProfile/:id
async function getSingleNonResidentsProfileHandler(req, res) {
  try {
    const { id } = req.params;

    const profile = await getNonResidentById(id);
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Non-resident profile not found" });
    }

    const identificationCards = await getNonResidentIdsByNonResidentId(id);

    res.json({
      ...profile,
      identificationCards: identificationCards.map((row) => ({
        idTypeId: row.hris_id_types_id,
        idNumber: row.id_number,
      })),
    });
  } catch (error) {
    console.error("Error fetching non-resident profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/nonResidentsProfile
async function createNonResidentsProfileHandler(req, res) {
  const client = await pool.connect();

  try {
    const data = req.body;

    // REQUIRED: (keep similar to residents, but NO barangay/subdivision/street FK)
    const requiredStrings = [
      "first_name",
      "last_name",
      "nationality",
      "gender",
      "civil_status",
      "alagang_valmocina_id",

      "gis_region_id",
      "gis_province_id",
      "gis_municipality_id",

      "street_address_line", // ✅ your text address line
    ];

    for (const field of requiredStrings) {
      if (!data[field] || String(data[field]).trim() === "") {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    if (!data.birthdate) {
      return res.status(400).json({ message: "birthdate is required" });
    }
    const date = new Date(data.birthdate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "birthdate is not a valid date" });
    }

    // TRANSACTION
    await client.query("BEGIN");

    const profile = await createNonResidentsProfile(data, req.user.sub, client);

    const identificationCards = data.identificationCards || [];
    if (identificationCards.length > 0) {
      await createNonResidentIds(
        profile.id,
        identificationCards.filter((c) => c.idTypeId && c.idNumber),
        client
      );
    }

    await client.query("COMMIT");
    res.status(201).json(profile);
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Duplicate ID type detected for this non-resident",
      });
    }

    console.error("Error creating non-resident:", error);
    res.status(500).json({ message: "Failed to create non-resident" });
  } finally {
    client.release();
  }
}

// PUT /api/nonResidentsProfile/:id
async function updateNonResidentsProfileHandler(req, res) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const incoming = req.body;

    const existing = await getNonResidentsProfileByIdRaw(id);
    if (!existing) {
      return res.status(404).json({ message: "Non-resident not found" });
    }

    // OPTIONAL ownership rule like residents
    if (
      req.user.role === "COORDINATOR" &&
      existing.created_by !== req.user.sub
    ) {
      return res.status(403).json({
        message: "You are not allowed to update this non-resident profile",
      });
    }

    const merged = { ...existing, ...incoming };

    const requiredStrings = [
      "first_name",
      "last_name",
      "nationality",
      "gender",
      "civil_status",
      "alagang_valmocina_id",

      "gis_region_id",
      "gis_province_id",
      "gis_municipality_id",

      "street_address_line",
    ];

    for (const field of requiredStrings) {
      if (!merged[field] || String(merged[field]).trim() === "") {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    if (!merged.birthdate) {
      return res.status(400).json({ message: "birthdate is required" });
    }
    if (isNaN(new Date(merged.birthdate).getTime())) {
      return res.status(400).json({ message: "birthdate is not a valid date" });
    }

    await client.query("BEGIN");

    const updated = await updateNonResidentsProfile(
      id,
      merged,
      req.user.sub,
      client
    );

    if (incoming.identificationCards) {
      await replaceNonResidentIds(
        id,
        incoming.identificationCards.filter((c) => c.idTypeId && c.idNumber),
        client
      );
    }

    await client.query("COMMIT");
    res.json(updated);
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Duplicate ID type detected for this non-resident",
      });
    }

    console.error("Error updating non-resident:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
}

module.exports = {
  getNonResidentsPageHandler,
  getSingleNonResidentsProfileHandler,
  createNonResidentsProfileHandler,
  updateNonResidentsProfileHandler,
};
