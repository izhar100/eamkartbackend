const { Product } = require("../models/productModel");

const getProducts=async(req,res)=>{
    try {
        const products=await Product.find()
        res.status(200).json(products)
    } catch (error) {
        console.log("Error in getProducts")
        console.log(error.message)
        res.status(400).json({error:error.message})
    }
}

const getSingleProduct=async(req,res)=>{
    try {
        const {id}=req.params;
        const product=await Product.findOne({_id:id})
        res.status(200).json(product)
    } catch (error) {
        console.log("Error in getSingleProduct")
        console.log(error.message)
        res.status(400).json({error:error.message})
    }
}

const getSellerProduct=async(req,res)=>{
    try {
        const {sellerId}=req.body;
        const products=await Product.find({sellerId})
        res.status(200).json(products)
    } catch (error) {
        console.log("Error in getSellerProduct")
        console.log(error.message)
        res.status(400).json({error:error.message})
    }
}

const addProduct=async(req,res)=>{
    try {
        const newProduct=new Product(req.body)
        await newProduct.save()
        res.status(201).json({message:"New Product Added",product:newProduct})
    } catch (error) {
        console.log("Error in addProduct")
        console.log(error)
        res.status(400).json({error:error.message})
    }
}

const updateProduct=async(req,res)=>{
    try {
        const {sellerId}=req.body;
        const {id}=req.params;
        const product=await Product.findOne({_id:id})
        if(product.sellerId==sellerId){
            const updatedProduct=await Product.findByIdAndUpdate({_id:id},req.body)
            res.status(201).json({message:"Product Updated!",updateProduct})
        }else{
            res.status(400).json({error:"Not Authorized"})
        }
    } catch (error) {
        console.log("Error in updateProduct")
        console.log(error.message)
        res.status(400).json({error:error.message})
    }
}

const deleteProduct=async(req,res)=>{
    try {
        const {sellerId}=req.body;
        const {id}=req.params;
        console.log(sellerId,id)
        const product=await Product.findOne({_id:id})
        if(product.sellerId==sellerId){
            await Product.findByIdAndDelete({_id:id})
            res.status(201).json({message:"Product deleted!"})
        }else{
            res.status(400).json({error:"Not Authorized"})
        }
    } catch (error) {
        console.log("Error in deleteProduct")
        console.log(error.message)
        res.status(400).json({error:error.message})
    }
}

module.exports={
    addProduct,
    getProducts,
    getSellerProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct
}