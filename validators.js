// function valadateemailandemail(req){
//     console.log(req.body.email)
//     console.log(req.body.phoneno)
//     var phoneno = /^\d{10}$/;
//     var email=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
//     if (email.test(req.body.email)){
//         console.log("true")
//         if (req.body.phoneno.match(phoneno)) {
//             console.log("true")
//             return true
            
//         }     
//         else{
//             return false
//         }
//     }
//     else{
//         return false
//     }
// }

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