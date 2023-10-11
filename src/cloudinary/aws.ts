const AWS = require('aws-sdk');
const fs = require('fs');
const multerS3 = require('multer-s3');

const env = require('../config/index');

// Configure AWS with your credentials
// AWS.config.update({
//   accessKeyId: env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
// });

// // Create an S3 service object
// const s3 = new AWS.S3();

// Specify the S3 bucket name and file details
const bucketName = 'linkcollect-images';


// Configure AWS S3
const s3_new = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  });
  

let storageS3 = multerS3({
    s3: s3_new,
    bucket: bucketName,
    acl: 'public-read', // or desired permissions
    key: function (req, file, cb) {
      cb(null, 'uploads/' + Date.now() + '-' + file.originalname);
    },
   
  })

export { storageS3 };

