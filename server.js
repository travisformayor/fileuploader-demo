const express = require('express');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Load ENV Vars ================= //
require('dotenv').config()

// AWS =========================== //
const config = {
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION
};
let S3 = new AWS.S3(config); //Make sure its let so that you can change later

// Middleware ==================== //
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

// Test endpoint - add file to new S3 bucket
app.post('/s3test', async (req, res) => {
  try {
    // Create new bucket with unique name
    const bucketName = 'node-sdk-sample-' + uuid.v4();
    const createdBucket = await S3.createBucket({Bucket: bucketName});
    // Create test file for upload
    const keyName = 'hello_world.txt';
    const objectParams = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
    // Add test file to just created bucket
    const uploadedFile = await S3.putObject(objectParams);
    
    // No errors caught yet
    // console.log('Bucket creation response: ', createdBucket); // note: this has secrets in the output
    // console.log('File upload response: ', uploadedFile);

    const saveResponse = (circularResponse, output) => {
      // response object has a circular structure that causes stringify to fail
      // The workaround below is from mdn:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };

      const fixedResponse = JSON.stringify(circularResponse, getCircularReplacer());
      // {"otherData":123}
      // Write it to a file
      fs.writeFile(output, fixedResponse, (err) => { 
        if (err) throw err;
        console.log("Data is written to file successfully.")
      });
    }

    saveResponse(createdBucket, 'createdBucketOutput.json');
    saveResponse(uploadedFile, 'uploadedFileOutput.json');

    // console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
    return res.status(200).json({msg: 'Upload attempt has finished with no obvious errors'})

  } catch (err) {
    // Something went wrong
    console.error(err, err.stack);
    return res.status(500).json({msg: 'Something went wrong', errorData: err})
  }
});

// Start Dev Server
app.listen(PORT, () => console.log(`Started server: ${PORT}`))