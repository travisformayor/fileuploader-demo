const express = require('express');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
// const uuid = require('uuid');
// const fs = require('fs');

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
const S3 = new AWS.S3(config);

// Middleware ==================== //
// Express File Upload
app.use(fileUpload({
  // https://www.npmjs.com/package/express-fileupload
  limits: { fileSize: 3 * 1024 * 1024 }, // max file size in bytes, represented as mb here
  safeFileNames: true, // strip off any hinky characters from the filename
  preserveExtension: 4, // max length the .ext can be (.jpeg, .png, etc)
  abortOnLimit: true, // return a response of 413 of over file size limit
}));

// API Endpoints ================= //
// Upload Endpoint - Validate and Send to S3. Return status and url.
app.post('/upload', async (req, res) => {
  // The 'app.use(fileUpload...' middleware above aborts on files to large, before even getting here
  if (req.files === null) {
    return res.status(400).json({msg: 'No file uploaded'});
  } 
  const { file } = req.files;
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // File is jpg or png, great!
    console.log('mime type is: ', file.mimetype);
    console.log('md5 hash of file: ', file.md5);

    const fileName = (file.mimetype === 'image/jpeg') ? `${file.md5}.jpg` : `${file.md5}.png`
    // const keyName = 'hello_world.txt';
    const objectParams = {Bucket: 'marker-dev-981f2859', ACL: 'public-read', Key: fileName, Body: file.data};
    // Add test file to just created bucket
    try {
      const uploadedFile = await S3.putObject(objectParams).promise();
      if (uploadedFile.ETag) {
        // The ETag is returned if upload is successful. It is an md5 hash of the file
        const fileETag = uploadedFile.ETag.replace(/"/g, ''); // remove start and end quotes if included
        console.log("The returned ETag: ", fileETag)
        console.log("The files md5 hash: ", file.md5)
        console.log("Do they equal? ", (fileETag === file.md5 ? true : false))
        
        if (fileETag === file.md5) {
          const filePath = `https://marker-dev-981f2859.s3-us-west-2.amazonaws.com/${fileName}`
          return res.status(200).json({msg: 'Upload successful', fileName, filePath});
        } else {
          // The hash returned by AWS does not match the file we received
          // Upload was potentially cut off or corrupted in some way
          return res.status(500).json({msg: 'Error uploading file. Please try again'})
        }
      } else {
        // The response didn't include the ETag md5 hash
        // The upload failed to complete in some unexpected way
        return res.status(500).json({msg: 'Error uploading file. Please try again'})
      }
    } catch (err) {
      // Something went wrong
      console.error(err, err.stack);
      return res.status(500).json({msg: 'Something went wrong', errorData: err})
    }
  } else {
    return res.status(400).json({msg: 'Unsupported file type'})
  }
});

// // Note: to save the file to a folder on the server, you can do:
// file.mv(`${__dirname}/client/public/uploads/${fileName}`, err => {
//   if (err) {
//     console.error(err);
//     // ToDo: have this pipe to react which turns it to errors message
//     return res.status(500).send(err);
//   }
//   // send successful upload info
//   return res.json({fileName: fileName, filePath: `/uploads/${fileName}`});
// });

// // Note: How to create new bucket with unique name
// const bucketName = 'node-sdk-sample-' + uuid.v4();
// const createdBucket = await S3.createBucket({Bucket: bucketName}).promise();
// Create test file for upload
  
// Start Dev Server
app.listen(PORT, () => console.log(`Started server: ${PORT}`))