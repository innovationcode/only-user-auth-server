const router = require('express').Router();
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const usersDb = require("../../database");

//For Validation of data while registering and login
const checkRegistrationFields = require('../../validation/register.js');
// SendEmail from Utilities
const sendEmail = require("../../utilities/sendEmail");

//to check user route 
router.get('/', (req, res) => {
    res.send("Users Route  👏");
})

// Register route
router.post("/register", (req, res) => {
    // Ensures that all entries by the user are valid
    const { errors, isValid } = checkRegistrationFields(req.body);

    // If any of the entries made by the user are invalid, a status 400 is returned with the error
    if (isValid) {
        return res.status(400).json(errors);
    }
  
    let token;
    crypto.randomBytes(48, (err, buf) => {
                                            if (err) throw err;
                                            token = buf.toString("base64")
                                                       .replace(/\//g, "") // Because '/' and '+' aren't valid in URLs
                                                       .replace(/\+/g, "-");
        return token;
    });

    bcrypt.genSalt(12, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password1, salt, (err, hash) => {
                if (err) throw err;
                usersDb("users").returning(["id", "email", "registered", "token"])
                                .insert({ email: req.body.email,
                                          password: hash,
                                          registered: Date.now(),
                                          token: token,
                                          createdtime: Date.now(),
                                          emailverified: "f",
                                          tokenusedbefore: "f"
                                 })
                                .then(user => {
                                            // let to = [user[0].email] //Email address must be an array
                                            
                                            // // When you set up your front-end you can create a working verification link here
                                            // let link = "https://yourWebsite/v1/users/verify/" + user[0].token;
                                            // //Sunbject of your email
                                            // let sub = "Confirm Registartion";

                                            // //content as HTML
                                            // let content = "<body><p>Please verify your email.</p><a href = "+ link + ">Verify email</a></body>";

                                            // //use the Email function from utilities ...
                                            // sendEmail.Email(to, sub, content);
                                            res.json(token)                                 })
                                .catch(err => {
                                    console.log(err);
                                    errors.account = "Email already registered";
                                    res.status(400).json(errors);
                                 });
        }); //bcrypt hash password ends
    }); // bcrypt salt function ends
}); // register route ends

//Token verification route
router.post('/verify/:token', (req, res) => {
    const {token} = req.params;
    const errors = {};
    usersDb.returning(['email', 'emailverified', 'tokenusedbefore'])
           .from('users')
           .where({token : token, tokenusedbefore: 'f'})
           .update({emailverified: 't', tokenusedbefore: 't'})
           .then(data => {
                 if( data.length > 0){
                     res.json("Email vrified Please login to access your account.");
                 }
                 //If the above query comes back empty, check the database again to see if the token exists and if 'emailverified' is true. 
                 // send a message stating 'Email already verified
                 else {
                     usersDb.select('email', 'emailverified', 'tokenusedbefore')
                            .from('users')
                            .where('token', token)
                            .then(check => {
                                if(check.length > 0){
                                    if (check[0].emailverified) {
                                        errors.alreadyVerified = "Email already verified. Please login to your account.";
                                        res.status(400).json(errors);
                                    }
                                } 
                                //If token is absent there could be two possibilities, the user did not register or the token has expired
                                else {
                                    errors.email_invalid = "Enail invalid. Please check if you have registered with the correct email address or re-send the verification link to your email";
                                    res.status(400).json(errors);
                                }
                             })
                            .catch(err => {
                                errors.db = "Bad request";
                                res.status(400).json(errors);
                             });
                 }
             })
            .catch(err => {
                errors.db = "Bad request";
                res.status(400).json(errors);
            });
});



module.exports = router;