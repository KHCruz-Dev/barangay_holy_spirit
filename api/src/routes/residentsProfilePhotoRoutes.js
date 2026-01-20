const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const s3 = require("../config/s3");

const {
  getResidentsProfileById,
  saveResidentPhoto,
} = require("../models/residentProfileModel");

const router = express.Router();

/* ============================
   MULTER (MEMORY BUFFER)
============================ */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

/* ============================
   PHOTO UPLOAD (S3)
============================ */
router.post("/:id/photo", upload.single("photo"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const existing = await getResidentsProfileById(id);
    if (!existing) {
      return res.status(404).json({ message: "Resident not found" });
    }

    const optimizedBuffer = await sharp(req.file.buffer)
      .rotate()
      .resize(500, 500, {
        fit: "cover",
        position: "center",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 90,
        chromaSubsampling: "4:4:4",
        mozjpeg: true,
      })
      .toBuffer();

    if (optimizedBuffer.length > 600 * 1024) {
      return res.status(400).json({
        message: "Photo too large after optimization",
      });
    }

    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;
    const key = `residents_profile/${id}.jpg`;

    await s3
      .putObject({
        Bucket: bucket,
        Key: key,
        Body: optimizedBuffer,
        ContentType: "image/jpeg",

        // 🔑 REQUIRED FOR CORS + CANVAS EXPORT
        CacheControl: "public, max-age=31536000",
        MetadataDirective: "REPLACE",
      })
      .promise();

    const imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    const updated = await saveResidentPhoto(id, {
      img_url: imageUrl,
      img_mime: "image/jpeg",
    });

    res.json({
      message: "Photo uploaded successfully",
      residentsProfile: updated,
    });
  } catch (error) {
    console.error("S3 photo upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
