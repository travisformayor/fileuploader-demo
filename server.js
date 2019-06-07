const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware ==== //
app.use(fileUpload());

// Upload Endpoint
app.post('/upload', (req, res) => {
  console.log('Hello, I am the upload endpoint')
  console.log('What do you have for me? - ', req.files)
  if (req.files === null) {
    return res.status(400).json({msg: 'No file uploaded'});
  }
  // get file...
  const file = req.files.file;
  // save it to public folder in react
  // ToDo: add aws option here
  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      // ToDo: have this pipe to react which turns it to errors message
      return res.status(500).send(err);
    }
    // send successful upload info
    res.json({fileName: file.name, filePath: `/uploads/${file.name}`});
  });
});

// Start Dev Server
app.listen(PORT, () => console.log(`Started server: ${PORT}`))