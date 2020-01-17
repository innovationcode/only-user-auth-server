const knex = require('knex');
require('dotenv').config();
console.log(process.env.DATABASE_PASSWRD);

const database = knex({
    client : "pg", //pg is the database library for postgreSQL on knexjs
    connection : {
        host: "127.0.0.1", // Your local host IP
        user : "postgres", // Your postgres user name
        password: process.env.DATABASE_PASSWRD, // Your postgres user password
        database: "user_auth_api", // Your database name
    }
});

if(!database) {
    console.log("DATABASE CONNECTING ERROR");
}

module.exports = database; //Every time you need a connection to your database you can import this file