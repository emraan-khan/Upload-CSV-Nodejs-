import { Upload } from "../model/csv.model.js";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { title } from "process";

export default class csvController {
  constructor() {
    this.upload = Upload;
  }

  async uploadCsv(req, res) {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded"); //check if file exists
      }
      //console.log('File received:', req.file);
      const { filename, path, size } = req.file;
      const newUpload = new this.upload({ filename, path, size }); //create new csv-file obj model
      await newUpload.save();

      console.log("File uploaded successfully");
      //res.status(200).send("File uploaded successfully");
      //redirect to homepage
      res.redirect('/home');
    } catch (error) {
      console.error(error);
      res.status(400).send('Error uploading file');
    }
  }

  async getUploadedFiles() {
    try {
      //console.log('Fetching uploaded files...');
      //get all the files from the db
      const files = await Upload.find({}, { filename: 1, filePath: 1, size: 1 });
      return files;
    } catch (error) {
      throw new Error('Failed to fetch uploaded files');
    }
  }

  async deleteFile(req, res, next) {
    try {
      const fileId = req.body.fileId; //get the file-id from the body of response
      const file = await Upload.findById(fileId);
      console.log('Deleting file with id:', fileId);
      await Upload.findByIdAndDelete(fileId); //delete the corresponding file from the db
      const filePath = path.join('uploads', file.filename); //delete the file from the uploads folder
      fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ error: 'Error deleting file' });
      }
      console.log('File deleted successfully:', filePath);
      res.json({ message: 'File deleted successfully' });
    });

    }catch (error) {
      console.error(error);
      res.status(400).send('Error deleting file');
    }
  }


  async readFile(req, res) {
    try{
      //console.log('Reading file...');
      const id = req.query.id;
      const searchQuery = req.query.q; // Get the search query from the URL query parameters
      const file = await Upload.findById(id);
      //console.log('File found:', file);
      if(!file){
        return res.status(404).send('File not found');
      }
      const filePath = path.join(file.path);
      const results = [];
      fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => {
            results.push(data);
          })
          .on("end", () => {
            if (results.length === 0) {
              return res.status(404).send("No data found in the CSV file");
            }
  
            const tableHeaders = Object.keys(results[0]);
            let tableRows = results;
  
            if (searchQuery) {
              // Filter the tableRows based on the search query
              tableRows = tableRows.filter((row) =>
                Object.values(row).some((value) =>
                  value.toLowerCase().includes(searchQuery.toLowerCase())
                )
              );
            }
            res.render('view.ejs', {
              title: file.filename, // Set the title to the original filename
              file: file, // Pass the file object
              searchQuery: req.query.q || '', // Pass the search query from the request
              tableHeaders: tableHeaders, // Pass the table headers
              tableRows: tableRows, // Pass the table rows
              csvData: results, // Pass the CSV data
            });
          })
          .on("error", (error) => {
            console.error("CSV parsing error:", error);
            res.status(500).send("Error parsing CSV file");
          });


    }catch(error){
      console.error(error);
      res.status(400).send('Error reading file');
    }
  }
}