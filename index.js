const express=require("express")
const { connection } = require("./db")
const app=express()
const cors=require("cors")
const cloudinary=require("cloudinary")
const { userRouter } = require("./routes/userRoute")
const { productRouter } = require("./routes/productRoute")
app.use(express.json({limit: '20mb'}))
app.use(express.urlencoded({limit: '20mb',extended:true}))
app.use(cors())
require("dotenv").config()
const port=process.env.port||8000

//cloudinay configration
cloudinary.config({
    cloud_name:process.env.CLOUDINAY_NAME,
    api_key:process.env.CLOUDINAY_API_KEY,
    api_secret:process.env.CLOUDINAY_API_SECRET
 })

app.use("/user",userRouter)
app.use("/product",productRouter)
app.listen(port,async()=>{
    try {
       await connection
       console.log("connected to database") 
       console.log(`server is running at: http://localhost:${port}`)
    } catch (error) {
        console.log("error connecting database")
        console.log(error)
    }
})