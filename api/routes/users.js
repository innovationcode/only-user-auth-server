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
                                            let to = [user[0].email]; //Email address must be an array

                                            // When you set up your front-end you can create a working verification link here
                                            let link = "yourWebsite/users/verify.." + user[0].token;
                                            //Sunbject of your email
                                            let sub = "Confirm Registartion";

                                            //content as HTML
                                            let content = "<body><p>Please verify your email.</p><a href = "+ link + ">Verify email</a></body>";

                                            //use the Email function from utilities ...
                                            sendEmail.Email(to, sub, content);
                                            res.json("Success!")
                                 })
                                .catch(err => {
                                    console.log(err);
                                    errors.account = "Email already registered";
                                    res.status(400).json(errors);
                                 });
        }); //bcrypt hash password ends
    }); // bcrypt salt function ends
}); // register route ends

//

module.exports = router;