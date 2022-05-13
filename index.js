//index js file using only asyn and await
const express = require("express")
const jwt = require("jsonwebtoken")
var mongoclient = require("mongodb").MongoClient
var bodyparser = require("body-parser");
const res = require("express/lib/response");
var dburl = "mongodb://localhost:27017/";
var validate=require("./validators")
body = bodyparser.urlencoded({ extended: true });
const app = express()

app.use(express.json());

app.get("/user/signin", function (req, res) {
    res.sendFile(__dirname + "/src/signin.html")
});
app.get("/user/signup", function (req, res) {
    res.sendFile(__dirname + "/src/signup.html")
});
app.get("/src/successpage.html", function (req, res) {
    res.sendFile(__dirname + "/src/successpage.html")
});
app.get("/src/failpage.html", function (req, res) {
    res.sendFile(__dirname + "/src/failpage.html")
});
app.get("/src/sucesssignuppage.html", function (req, res) {
    res.sendFile(__dirname + "/src/sucesssignuppage.html")
});
app.get("/src/failsignuppage.html", function (req, res) {
    res.sendFile(__dirname + "/src/failsignuppage.html")
});

app.post("/user/signup/register", body, function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    let email = req.body.email;
    let phoneno = req.body.phoneno;
    let flag
    let srcObj = { username: username, email: email };
    let inserobg = { username: username, password: password, confirmpassword: confirmpassword, email: email, phoneno: phoneno };
    (validate.validatepassword(req) && validate.validateemail(req)) ? insertUser(srcObj, inserobg, res) : res.write("<h1>Password doesn't match with confirm password</h1>")
});

async function insertUser(srcObj, inserobg, res) {
    const result = await mongoclient.connect(dburl);
    let database = result.db("userdetails");
    let checkUser = await database.collection("userdetails").find(srcObj).toArray();
    if (checkUser.length != 0) {
        res.send("User already present")
    }
    else {
        let insertStatus = await database.collection("userdetails").insertOne(inserobg);
        insertStatus.acknowledged ? inserttoken(inserobg, inserobg.username, res) : res.send("Some error has occured")
    }
}

async function inserttoken(inserobg, username, res) {
    const result = await mongoclient.connect(dburl);
    let database = result.db("userdetails");
    let token = await jwt.sign({ inserobg }, "signup");
    var tokenobj = { randomtoken: token, username: username }
    await database.collection("tokendetails").insertOne(tokenobj) ?
        res.send("User and their token has been inserted successfully")
        :
        res.send("Some error has been occured")
}

app.post("/user/signin/login", body, async function (req, res) {
    const mdatabase = await mongoclient.connect(dburl);
    var database = mdatabase.db("userdetails");
    var username = req.body.username;
    var srcObj = { username: username };
    let findresult = await database.collection("tokendetails").find(srcObj).toArray();
    findresult.length>0 ? authenticatetoken(findresult[0].username,findresult[0].randomtoken,req,res) : res.send("User not found in the database")
});
async function authenticatetoken(db_username , token, req,res){

    let checkvalidation = await jwt.verify(token, "signup")
    let token_password = checkvalidation.inserobg.password
    db_username ===  req.body.username && token_password ===  req.body.password ? 
    res.send("User has been successfully signed In"):
    res.send("Please provide your correct password")
}

app.listen(5000, () => {
    console.log("server listening in the port address 5000")
})
