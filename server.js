// Code for the server


import express from 'express';
import multer, { diskStorage } from 'multer';
import cors from 'cors';
import { extname } from 'path';

const app = express();
const port = 5000;

app.use(cors());

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single('file');

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('File uploaded successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});