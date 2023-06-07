/*
1. Establish a connection with mongo DB and check if admin exists then good, else create one admin user
2. Start our server which will listen for HTTP requests at port number 8080
*/
const mongoose = require('mongoose')
const dbConfig = require('./configs/db.config')
const serverConfig = require('./configs/server.config')
const User = require('./models/user.model')
const bcrypt = require('bcryptjs')
require("dotenv").config()
var cors = require('cors');


//Express settings
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

//Establish DB connection
mongoose.connect(dbConfig.DB_URL)
const db = mongoose.connection
db.on("error", () => {
    console.log("Error while connecting to DB")
})
db.once("open", () => {
    console.log("Connected to mongo DB")

    //Create an admin if admin user doesn't exist
    init();
})

async function init(){
    var user = await User.findOne({userId: "admin"});

    if(user){
        console.log("Admin user already present");
        return;
    }

    try{
        user = await User.create({
            name: "Jeevendra Singh",
            userId: "admin",
            email: "jeevendra.singh1992@gmail.com",
            userType: "ADMIN",
            userStatus: "APPROVED",
            password: bcrypt.hashSync("Welcome1", 8)
        });

        console.log(user)
    }catch(e){
        console.log("Error while creating admin user " + e);
    }
}


//Import the routes
require('./routes/auth.routes')(app)
require('./routes/user.routes')(app)
require('./routes/ticket.routes')(app)

//App(Server) to listen for HTTP requests at port 8080
app.listen(serverConfig.PORT, () => {
    console.log("Application started on the port 8080")
})
