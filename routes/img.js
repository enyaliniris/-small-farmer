const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

router.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatar',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
})

const upload = multer({ storage })

router.post("/upload", upload.single("file"), async (req, res) => {
  res.json(req.file.path)  // path 是 Cloudinary 回傳的完整 URL
})

module.exports = router;