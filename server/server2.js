const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Handle POST requests to '/upload'
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Image uploaded successfully!');
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
