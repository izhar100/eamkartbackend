const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    image1:{type:String,required:true},
    image2:{type:String},
    category:{type:String},
    brand:{type:String},
    cod:{type:Boolean, default:true},
    number:{type:String},
    description:{type:String,required:true},
    gender:{type:String},
    size:{type:[String]},
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    price:{type:Number,required:true}

},{
    versionKey:false
})

const Product=mongoose.model("Product",userSchema)

module.exports={
    Product
}