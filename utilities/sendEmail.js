const aws = require('aws-sdk');
require('dotenv').config({ path: '../.env'}); //to access root directory .env file set path in config

aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
aws.config.secretAccessKey = process.env.AWS_SECRET_KEY
aws.config.region = "us-east-1"; 

//create an Email function
function Email(to, sub, content) {
    let ses = new aws.SES();

    let from = "user@example.com";  // The email address added here must be verified in Amazon SES
    
    //Amazon SES email format
    ses.sendEmail({
        Source: from, 
        Destination: {ToAddresses: to},
        Message: {
                  Subject: {
                            Data: sub
                  },
                  Body:{
                        Html: {
                                Data: content
                        }
                  }
        },
        function(err, data) {
                              if (err) {
                                        console.log(err);
                              } else {
                                       console.log("Email sent:");
                                       console.log(data);
                              }
        }
    });
}

// Export the Email function
module.exports = {
                   Email
                 };