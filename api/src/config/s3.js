const AWS = require("aws-sdk");

// DO NOT set accessKeyId / secretAccessKey manually
// Let AWS SDK resolve credentials automatically

AWS.config.update({
  region: process.env.AWS_REGION || "ap-southeast-1",
});

const s3 = new AWS.S3();

module.exports = s3;
