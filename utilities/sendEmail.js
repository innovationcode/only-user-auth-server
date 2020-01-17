const aws = require('aws-sdk');
require('dotenv').config({ path: '../.env'});

console.log(process.env.DATABASE_PASSWRD);

console.log(process.env.AWS_ACCESS_KEY_ID)
console.log(process.env.AWS_SECRET_KEY)
aws.config.region = "us-east-1"; 
console.log(aws.config.region)
