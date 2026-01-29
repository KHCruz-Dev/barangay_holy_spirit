const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/media/:folder/:id", async (req, res) => {
  try {
    const { folder, id } = req.params;

    // allow only known folders (security)
    const allowedFolders = [
      "residents_profile",
      "non_residents_profile",
      "accounts",
      "assets",
      "health_and_wellness",
    ];

    if (!allowedFolders.includes(folder)) {
      return res.status(400).end();
    }

    const s3Url = `https://barangayholyspirit-media.s3.ap-southeast-1.amazonaws.com/${folder}/${id}.jpg`;

    const response = await axios.get(s3Url, {
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.send(response.data);
  } catch (err) {
    res.status(404).end();
  }
});

module.exports = router;
