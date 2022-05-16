var validatefields ={
    validateemail: function validateemail(req){
        var email=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (email.test(req.body.email)){
            return true
        }
        else{
            return false
        }
    },
    validatephone: function validatephone(req){
        var phoneno = /^\d{10}$/;
        if (req.body.phoneno.match(phoneno)){
            return true
        }
        else{
            return false
        }
    },
    validatepassword: function validatepassword(req){
        if(req.body.password === req.body.confirmpassword){
            return true
        }
        else{
            return false
        }
    }
}

module.exports=validatefields;