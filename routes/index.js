var express = require('express');
var router = express.Router();
var fs = require('fs'),
    path = require('path');

// Import Converter for converting docx to pdf
var docxConverter = require('docx-pdf');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Beknazar' });
});

/* Endpoint to convert docx file into pdf */
router.post('/convert', async (req, res, next) => {
  console.log("Converting file...");
  // Convert the file from local folder: public/uploads
  const filePath = path.join(__dirname, '../public/uploads/template.docx');
  console.log("File path: ", filePath);
  const outputFilePath = path.join(__dirname, '../public/uploads/template.pdf');
  // Convert the file
  docxConverter(filePath, outputFilePath, function(err, result) {
    if (err) {
      console.log("Error converting file: ", err);
    } else {
      console.log("File converted successfully!");
      // Return the outputFile as response to download
      res.download(outputFilePath);
    }
  });
});

module.exports = router;
