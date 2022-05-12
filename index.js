const express = require("express")
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
    var username = req.body.username;
    var password = req.body.password;
    var confirmpassword = req.body.confirmpassword;
    var email = req.body.email;
    var phoneno = req.body.phoneno;
    var flag

    mongoclient.connect(dburl, function (err, db) {
        if (password == confirmpassword) {
            var database = db.db("userdetails");
            var srcObj = { username: username, email: email };
            database.collection("userdetails").find(srcObj).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (result.length != 0) {
                        console.log("User already present")
                        flag = false
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
                                inserttoken(inserobg, username)
                            }
                        });
                        flag = true
                    }
                }
                callsignuppage(flag, res)
            });
        }
        else {
            flag = false
        }
        console.log(flag)
        callsignuppage(flag, res)
    });

});

function callsignuppage(flag, res) {
    if (flag == true) {
        res.redirect('/src/sucesssignuppage.html')
        res.end();
    }
    if (flag == false) {
        res.redirect('/src/failsignuppage.html')
        res.end();
    }
}

app.post("/user/signin/login", body, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var flag
    mongoclient.connect(dburl, function (err, db) {
        if (err) {
            console.log(err);
        }
        else {
            var database = db.db("userdetails");
            var srcObj = { username: username };
            database.collection("tokendetails").find(srcObj).toArray(function (err, result) {
                if (err) {
                    // console.log(err);
                    flag = false
                    console.log("User not found")
                }
                else if (result.length > 0) {
                    let db_username = result[0].username
                    let token = result[0].randomtoken
                    const bearer = token.split(' ')
                    const authtoken = bearer[1]
                    let randomtoken = authtoken

                    jwt.verify(randomtoken, "signup", (err, data) => {
                        if (err) {
                            flag = false
                            console.log("Token expired")
                        }
                        else {
                            let token_password = data.inserobg.password
                            if (db_username == username && token_password == password) {
                                flag = true
                            }
                            else {
                                flag = false
                            }
                        }
                    })
                }
                else {
                    flag = false
                    console.log("User not found")
                }
                callsigninpage(flag, res)
            });
        }
    });
});

function callsigninpage(flag, res) {
    if (flag == true) {
        res.redirect('/src/successpage.html')
        res.end();
    }
    if (flag == false) {
        res.redirect('/src/failpage.html')
        res.end();
    }
}

app.post("/signin", verifytoken, (req, res) => {
    jwt.verify(req.token, "signup", (err, data) => {
        if (err) {
            res.sendStatus(403)
        }
        else {
            console.log(data)
            res.json({
                data
            })
        }
    })
})

function inserttoken(inserobg, username) {
    mongoclient.connect(dburl, function (err, db) {
        jwt.sign({ inserobg }, "signup", { expiresIn: 300 }, (err, token) => {
            var randomtoken = "Bearer "
            randomtoken += token
            var tokenobj = { randomtoken: randomtoken, username: username }
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
    return true
}



app.post("/signup", (req, res) => {
    const sampleuser = {
        id: 1,
        name: "logamithran",
        email: "logamithran2001@gmail.com"
    }
    jwt.sign({ sampleuser }, "signup", { expiresIn: 20 }, (err, token) => {
        res.json({
            token
        })
    })
})


app.listen(5000, () => {
    console.log("server listening in the port address 5000")
})


function verifytoken(req, res, next) {
    const bearerheader = req.headers['authorization']
    console.log(req)
    if (bearerheader !== undefined) {
        const bearer = bearerheader.split(' ')
        const authtoken = bearer[1]
        req.token = authtoken
        next();
    }
    else {
        res.sendStatus(403)
    }
}