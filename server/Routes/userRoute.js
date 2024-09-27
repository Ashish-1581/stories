const { SignUp, login } =require("../controllers/Auth")
const express=require("express")
const router=express.Router()

router.post('/signup',SignUp);

router.post('/login',login);

module.exports=router;