var jwt = require("jsonwebtoken")
var authenticator ={
    authenticatetoken: async function authenticatetoken(db_username , token, req,res){
        let checkvalidation = await jwt.verify(token, "signup")
        let token_password = checkvalidation.inserobg.password
        db_username ===  req.body.username && token_password ===  req.body.password ? 
        res.send("User has been successfully signed In"):
        res.send("Please provide your correct password")
    }
}

module.exports=authenticator;