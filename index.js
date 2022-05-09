const express = require("express")
const http = require("http")
const jwt = require("jsonwebtoken")
var mongoclient = require("mongodb").MongoClient
var bodyparser = require("body-parser");
var dburl = "mongodb://localhost:27017/";
body = bodyparser.urlencoded({ extended: true });
const app = express()

app.use(express.json());

app.get("/user/signin", function (req, res) {
    res.sendFile(__dirname + "/src/signin.html")
});
app.get("/user/signup", function (req, res) {
    res.sendFile(__dirname + "/src/signup.html")
});
app.get("src/successpage", function (req, res) {
    res.sendFile(__dirname + "/src/successpage.html")
});
app.post("/user/signup/register", body, function (req, res) {
    mongoclient.connect(dburl, function (err, db) {
        if (err) {
            console.log(err);
        }
        else {
            var username = req.body.username;
            var password = req.body.password;
            var confirmpassword = req.body.confirmpassword;
            var email = req.body.email;
            var phoneno = req.body.phoneno;
            mongoclient.connect(dburl, function (err, db) {
                if (err) {
                    console.log(err);
                }
                else {
                    var database = db.db("userdetails");
                    var srcObj = { username: username, email: email };
                    database.collection("userdetails").find(srcObj).toArray(function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            if (result.length!=0) {
                                console.log("User already present")
                            }
                            else {
                                var inserobg = { username: username, password: password, confirmpassword: confirmpassword, email: email, phoneno: phoneno };
                                database.collection("userdetails").insertOne(inserobg, function (req, res) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log("Inserted successfully");
                                        db.close();
                                        inserttoken(inserobg)
                                    }
                                });
                            }
                            
                        }
                    });
        
                }
            });
        }
    });
    res.end();
});


app.post("/signin", verifytoken, (req, res) => {
    jwt.verify(req.token, "signup", (err, data) => {
        if (err) {
            res.sendStatus(403)
        }
        else {
            res.json({
                data
            })
        }
    })
})

function inserttoken(inserobg) {
    mongoclient.connect(dburl, function (err, db) {
        jwt.sign({ inserobg }, "signup", { expiresIn: 120 }, (err, token) => {
        var randomtoken = "Bearer "
        randomtoken += token
        var tokenobj = { randomtoken: randomtoken }
        var database = db.db("userdetails");
        database.collection("tokendetails").insertOne(tokenobj, function (req, res) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("User Inserted successfully");
                db.close();
            }
        });
    })
})
}



// app.post("/signup",(req,res)=>{
//     const sampleuser={
//         id: 1,
//         name: "mithran",
//     }
//     // console.log(req.body.username)
//     jwt.sign({sampleuser}, "signup" ,{expiresIn: 20}  , (err,token)=>{
//         res.json({
//             token
//         })
//     })
// })

app.listen(5000, () => {
    console.log("server listening in the port address 5000")
})


function verifytoken(req, res, next) {
    const bearerheader = req.headers['authorization']

    if (bearerheader !== undefined) {
        const bearer = bearerheader.split(' ')
        const authtoken = bearer[1]
        req.token = authtoken
        next();
    }
    else {
        res.sendStatus(403)
    }
    console.log(bearerheader)
}