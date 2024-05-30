import express from 'express';
import multer from 'multer';
import csvController from '../controller/csv.controller.js';
import { storage } from '../config/upload.middleware.js';


const router = express.Router();
const controller = new csvController();

// Middleware for handling file uploads
const upload = multer({ storage: storage });

// Route for fetching the list of uploaded files
router.get('/home', async (req, res) => {
  //console.log('Fetching uploaded files...');
  try {
    const files = await controller.getUploadedFiles(req,res);
    //console.log('Files fetched:', files);
    res.json(files);
  } catch (error) {
    console.log('Error fetching uploaded files:', error);
    res.status(500).json({ error: 'Failed to fetch uploaded files' });
  }
});


// Route for handling file uploads
router.post('/upload', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).send('No file uploaded');
  }
  controller.uploadCsv(req, res);
});

//Route for handling delete event
router.delete('/delete/', async (req, res) => {
  controller.deleteFile(req, res);
});

// Route to view the CSV file
router.get('/view/', async (req, res) => {
  const id = req.query.id; // Access 'id' from query parameters
  //console.log(`Extracted id: ${id}`);
  if (!id) {
    return res.status(400).send('Missing id parameter');
  }
  controller.readFile(req, res);
});
  


export default router;