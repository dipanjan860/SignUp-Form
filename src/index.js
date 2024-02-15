const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://0.0.0.0/registration-form");

const port = 5000;
const app = express();

const loginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    contact:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

const collection = new mongoose.model("users", loginSchema);

app.use(express.json());

app.use(express.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        contact: req.body.num,
        password: req.body.pass
    };

    const existingUser = await collection.findOne({
        email: data.email
    });
    if(existingUser){
        res.send("User Already Exists. Please Choose Another Email.");
    }else{
        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = encryptedPassword

        const userdata = await collection.insertMany(data);
        res.render("home");
        // console.log(userdata);
    }
});

app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({
            email: req.body.email
        });
        if(!check){
            res.send("Account Cannot Be Found !");
        }

        const matchPassword = await bcrypt.compare(req.body.pass, check.password);
        if(matchPassword){
            res.render("home");
        }else{
            res.send("Wrong Password !");
        }
    }catch{
        loginErr.textContent = "Wrong Password";
        loginErr.classList.remove("hidden");
    }
});

connect.then(() => {
    // console.log("Database connected successfully");
    app.listen(port, () => {
        console.log(`App running on port: ${port}`);
    });
}).catch((error) => {
    console.log("Database connection failed");
});

