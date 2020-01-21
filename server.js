const express = require('express');

const server = express();
const bodyParser = require("body-parser");

const userRoutes = require('./api/routes/users');

const tokenExpiry = require("./utilities/tokenExpiry");

// Configure body-parser settings//
// urlencoded is for bodies that have UTF-8 encoding.
// If {extended: false} you cannot use nested objects.
// e.g. nested obj = {person:{name: adam}}
server.use(bodyParser.urlencoded({ extended: true }));

// Parse json with body-parser
server.use(bodyParser.json());

// Setup your api routes with express
server.use("/api/users", userRoutes);

server.get('/', (req, res) => {
    res.send("Server ip 👍 💡 🎃 ")
})

module.exports = server;
