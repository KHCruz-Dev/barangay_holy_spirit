// src/controllers/residentsProfileController.js
const pool = require("../config/db");

const {
  getAllResidentsProfile,
  getResidentsProfileById,
  getResidentsPage,
  getResidentById,
  createResidentsProfile,
  updateResidentsProfile,
  deleteResidentsProfile,
  disableResidentsProfile,
  createResidentIds,
  replaceResidentIds,
  getResidentIdsByResidentId,
  getResidentsPageByRole,
  getAllResidentsProfileByRole,
  searchResidentsPage,
  bulkUpdateResidentIdStatus,
  updateResidentIdStatus,
  getResidentIdStatusCounts,
  getResidentsByIds,
} = require("../models/residentProfileModel");

// GET /api/residentsProfile (paginated grid overview)
async function getResidentsPageHandler(req, res) {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const search = req.query.search?.trim() || "";
    const idStatus = req.query.idStatus || null;

    // ✅ FIX: DEFINE barangayId
    const barangayId = req.query.barangayId || null;

    const result = await searchResidentsPage({
      limit,
      offset,
      query: search,
      idStatus,
      barangayId, // ✅ NOW DEFINED
      user: req.user,
    });

    res.json(result);
  } catch (err) {
    console.error("Residents fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/residentsProfile/all  (full list with all joins - use carefully)
async function getAllResidentsProfileHandler(req, res) {
  try {
    const residentsProfile = await getAllResidentsProfileByRole(req.user);

    res.json(residentsProfile);
  } catch (error) {
    console.error("Error fetching resident's profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/residentsProfile/:id
async function getSingleResidentsProfileHandler(req, res) {
  try {
    const { id } = req.params;

    // 1️⃣ Get resident profile
    const residentsProfile = await getResidentById(id);

    if (!residentsProfile) {
      return res.status(404).json({ message: "Resident's profile not found" });
    }

    // 2️⃣ Get resident ID cards
    const identificationCards = await getResidentIdsByResidentId(id);

    // 3️⃣ Return combined payload
    res.json({
      ...residentsProfile,
      identificationCards: identificationCards.map((row) => ({
        idTypeId: row.hris_id_types_id,
        idNumber: row.id_number,
      })),
    });
  } catch (error) {
    console.error("Error fetching resident's profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/residentsProfile
async function createResidentsProfileHandler(req, res) {
  const client = await pool.connect();

  try {
    const data = req.body;

    // =========================
    // VALIDATION
    // =========================
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
      "gis_barangay_id",
      "gis_subdivision_id",
      "gis_streets_id",
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

    if (data.email_address) {
      const email = String(data.email_address);
      if (email.length > 100) {
        return res
          .status(400)
          .json({ message: "email_address is too long (max 100 chars)" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "email_address is not a valid email" });
      }
    }

    // =========================
    // TRANSACTION START
    // =========================
    await client.query("BEGIN");

    // 1️⃣ Create residents_profile
    const profile = await createResidentsProfile(
      data,
      req.user.sub, // ✅ logged-in user ID
      client
    );

    // 2️⃣ Create resident_id rows (if any)
    const identificationCards = data.identificationCards || [];

    if (identificationCards.length > 0) {
      await createResidentIds(
        profile.id,
        identificationCards.filter((c) => c.idTypeId && c.idNumber),
        client // ✅ PASS CLIENT
      );
    }

    // =========================
    // COMMIT
    // =========================
    await client.query("COMMIT");

    res.status(201).json(profile);
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Duplicate ID type detected for this resident",
      });
    }

    console.error("Error creating resident:", error);
    res.status(500).json({ message: "Failed to create resident" });
  } finally {
    client.release();
  }
}

// PUT /api/residentsProfile/:id
async function updateResidentsProfileHandler(req, res) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const incoming = req.body;

    const existing = await getResidentsProfileById(id);
    if (!existing) {
      return res.status(404).json({ message: "Resident's profile not found" });
    }

    // 🔒 ROLE-BASED OWNERSHIP CHECK
    if (
      req.user.role === "COORDINATOR" &&
      existing.created_by !== req.user.sub
    ) {
      return res.status(403).json({
        message: "You are not allowed to update this resident profile",
      });
    }

    const merged = {
      ...existing,
      ...incoming,
    };

    // =========================
    // VALIDATION
    // =========================
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
      "gis_barangay_id",
      "gis_subdivision_id",
      "gis_streets_id",
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

    if (merged.email_address) {
      const email = String(merged.email_address);
      if (email.length > 100) {
        return res
          .status(400)
          .json({ message: "email_address is too long (max 100 chars)" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "email_address is not a valid email" });
      }
    }

    // =========================
    // TRANSACTION
    // =========================
    await client.query("BEGIN");

    // 1️⃣ Update resident profile
    const updated = await updateResidentsProfile(
      id,
      merged,
      req.user.sub, // 🔥 logged-in user
      client
    );

    // 2️⃣ Replace resident IDs (if provided)
    if (incoming.identificationCards) {
      await replaceResidentIds(
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
        message: "Duplicate ID type detected for this resident",
      });
    }

    console.error("Error updating resident:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
}

// PATCH /api/residentsProfile/:id/disable
async function disableResidentsProfileHandler(req, res) {
  try {
    const { id } = req.params;

    const existing = await getResidentsProfileById(id);
    if (!existing) {
      return res.status(404).json({ message: "Resident's profile not found" });
    }

    const disabled = await disableResidentsProfile(id);

    res.json({
      message: "Resident's profile disabled",
      residentsProfile: disabled,
    });
  } catch (error) {
    console.error("Error disabling resident's profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/residentsProfile/:id
async function deleteResidentsProfileHandler(req, res) {
  try {
    const { id } = req.params;

    // 1️⃣ Fetch existing record
    const existing = await getResidentsProfileById(id);
    if (!existing) {
      return res.status(404).json({ message: "Resident's profile not found" });
    }

    // 🔒 ROLE-BASED OWNERSHIP CHECK
    if (
      req.user.role === "COORDINATOR" &&
      existing.created_by !== req.user.sub
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this resident profile",
      });
    }

    // 2️⃣ Delete (allowed)
    const deleted = await deleteResidentsProfile(id);

    res.json({
      message: "Resident's profile deleted",
      residentsProfile: deleted,
    });
  } catch (error) {
    console.error("Error deleting resident's profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Search Filter
async function searchResidentsPageHandler(req, res) {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 20);
    const offset = (page - 1) * limit;
    const query = req.query.q?.trim() || "";

    const result = await searchResidentsPage({
      limit,
      offset,
      query,
      user: req.user,
    });

    res.json(result);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
}

// Update ID Status
// PATCH /api/residentsProfile/:id/id-status
async function updateResidentIdStatusHandler(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updated = await updateResidentIdStatus(id, status, req.user.sub);

    res.json(updated);
  } catch (err) {
    console.error("Update ID status error:", err);
    res.status(500).json({ message: "Failed to update ID status" });
  }
}

// Bulk update on Alagang Valmocina ID
async function bulkUpdateResidentIdStatusHandler(req, res) {
  try {
    const { residentIds, status } = req.body;

    if (!Array.isArray(residentIds) || !residentIds.length) {
      return res.status(400).json({ message: "residentIds required" });
    }

    if (!status) {
      return res.status(400).json({ message: "status required" });
    }

    const updated = await bulkUpdateResidentIdStatus(
      residentIds,
      status,
      req.user.sub
    );

    res.json({
      updatedCount: updated.length,
      updatedIds: updated.map((r) => r.id),
    });
  } catch (err) {
    console.error("Bulk update ID status error:", err);
    res.status(500).json({ message: "Bulk update failed" });
  }
}

// GET /api/residentsProfile/id-status-counts
async function getResidentIdStatusCountsHandler(req, res) {
  try {
    // 🔒 Optional: restrict to ID_PRINTER only
    if (req.user.role !== "ID_PRINTER") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const counts = await getResidentIdStatusCounts();

    res.json(counts);
  } catch (err) {
    console.error("ID status count error:", err);
    res.status(500).json({ message: "Failed to fetch ID status counts" });
  }
}

// ✅ BULK FETCH CONTROLLER
async function bulkGetResidents(req, res) {
  try {
    const { ids } = req.body;

    // 🛑 Validation
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "ids must be a non-empty array",
      });
    }

    const residents = await getResidentsByIds(ids);

    return res.json(residents);
  } catch (err) {
    console.error("Bulk get residents error:", err);
    return res.status(500).json({
      message: "Failed to fetch residents",
    });
  }
}

module.exports = {
  getResidentsPageHandler,
  getAllResidentsProfileHandler,
  getSingleResidentsProfileHandler,
  createResidentsProfileHandler,
  updateResidentsProfileHandler,
  disableResidentsProfileHandler,
  deleteResidentsProfileHandler,
  searchResidentsPageHandler,
  bulkUpdateResidentIdStatusHandler,
  updateResidentIdStatusHandler,
  getResidentIdStatusCountsHandler,
  bulkGetResidents,
};
