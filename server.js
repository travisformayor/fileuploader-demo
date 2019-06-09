const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware ==== //
// app.use(fileUpload());

app.use(fileUpload({
  // https://www.npmjs.com/package/express-fileupload
  limits: { fileSize: 3 * 1024 * 1024 }, // max file size in bytes, represented as mb here
  safeFileNames: true, // strip off any hinky characters from the filename
  preserveExtension: 4, // max length the .ext can be (.jpeg, .png, etc)
  abortOnLimit: true, // return a response of 413 of over file size limit
}));

// Upload Endpoint
app.post('/upload', (req, res) => {
  // the app.use(fileUpload options above aborts on files to large, before even getting here
  // console.log('Upload endpoint: What do you have for me? - ', req.files)
  if (req.files === null) {
    return res.status(400).json({msg: 'No file uploaded'});
  } 
  const { file } = req.files;
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // File is jpg or png, great!
    console.log('mime type is: ', file.mimetype);
    console.log('md5 hash of file: ', file.md5);
    // const file = req.files.file;
    // save it to public folder in react
    // ToDo: add aws option here
    // file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    const fileName = (file.mimetype === 'image/jpeg') ? `${file.md5}.jpg` : `${file.md5}.png`
    file.mv(`${__dirname}/client/public/uploads/${fileName}`, err => {
      if (err) {
        console.error(err);
        // ToDo: have this pipe to react which turns it to errors message
        return res.status(500).send(err);
      }
      // send successful upload info
      return res.json({fileName: fileName, filePath: `/uploads/${fileName}`});
    });
  } else {
    return res.status(400).json({msg: 'Unsupported file type'})
  }
});

// Start Dev Server
app.listen(PORT, () => console.log(`Started server: ${PORT}`))