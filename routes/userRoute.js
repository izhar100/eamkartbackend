const express=require("express");
const { login, signup, resetPassword } = require("../controllers/userController");
const userRouter=express.Router()

userRouter.get("/",async(req,res)=>{
    try {
        res.json({message:"User Router"})
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})
userRouter.post("/login", login);

userRouter.post("/signup", signup);

userRouter.post("/reset",resetPassword)


module.exports={
    userRouter
}