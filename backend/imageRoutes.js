// imageRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: "./config.env" });

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const imageRoutes = express.Router();

// Save image
imageRoutes.post("/images", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const filename = req.file.filename;
  const url = `http://15.206.185.169:3001/uploads/${filename}`; // ✅ Use your deployed backend domain/IP

  res.json({ filename, url }); // ✅ Return both for flexibility
});

// Optional legacy image route
imageRoutes.get("/images/:id", (req, res) => {
  const imagePath = path.join(__dirname, "public/uploads", req.params.id);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
});

module.exports = imageRoutes;
