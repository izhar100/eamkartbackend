const jwt=require("jsonwebtoken")
require("dotenv").config()

const auth=async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            return res.status(400).json({error:"Please login first"})
        }
        const decoded=jwt.verify(token,process.env.secretKey)
        req.body['sellerId']=decoded.userId;
        next()
    } catch (error) {
        console.log("Error in auth middleware")
        console.log(error.message)
        return res.status(400).json({error:error.message})
    }
}

module.exports={
    auth
}