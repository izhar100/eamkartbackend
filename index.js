const express=require("express")
const { connection } = require("./db")
const app=express()
const cors=require("cors")
const { userRouter } = require("./routes/userRoute")
const { productRouter } = require("./routes/productRoute")
app.use(express.json())
app.use(cors())
require("dotenv").config()
const port=process.env.port||8000

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