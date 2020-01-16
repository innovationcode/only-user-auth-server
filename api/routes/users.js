const router = require('express').Router();
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const usersDb = require("../../database");

//For Validation of data while registering and login
const checkRegustrationFields = require('../../validation/register.js');

//to check user route 
router.get('/', (req, res) => {
    res.send("Users Route  👏");
})

//Register route
router.post('/register', (req, res) => {
    //Ensure all entries by the user are valid
    const { errors, isValid } = checkRegustrationFields(req.body);

    // If any of the entries made by the user are invalid, a status 400 is returned with the error
    if(!isValid) {
        return res.status(400).json(errors);
    }

    //Using crypto.randomBytes, we generate a random token with a size of 48 bytes
    //that we will use to verify users email addresses
    let token;
    crypto.randomBytes(48, (err, buf) => {
        if(err) throw err;
        token = buf.toString("base64").replace(/\//g, "-").replace(/\+/g, "-"); //Because '/' and '+' are not valid in URL's
        return token;
    });
    
    //With a salt factor of 12 we hash the users password with bcrypt so that we don't just store it as plain text in the database.
    //adding users email, password, registration date, token, the date the token to users table
    bcrypt.genSalt(12, (err, salt) => {
        if(err) throw err;
        bcrypt.hash(req.body.password1, salt, (err, hash) => {
            if(err) throw err;

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
                                    // This is where the api returns json to the /register route
                                    // Return the id, email, registered on date and token here
                                    // Sending the user's token as a response here is insecure,
                                    // but it is useful to check if our code is working properly
                                    res.json(user[0]);
                             })
                            .catch(err => {
                                errors.account = "Email already registered";
                                res.status(400).json(errors)
                            });
        }) //bcrypt hash ends
    })//bcrypt salt generation ends
})//register route ends

module.exports = router;