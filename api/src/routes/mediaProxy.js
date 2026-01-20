const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/resident-photo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const s3Url = `https://barangayholyspirit-media.s3.ap-southeast-1.amazonaws.com/residents_profile/${id}.jpg`;

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
