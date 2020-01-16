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
    
})

module.exports = router;