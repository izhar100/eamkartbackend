const { Product } = require("../models/productModel");
const cloudinary=require("cloudinary").v2

// const getProducts=async(req,res)=>{
//     try {
//         const products=await Product.find()
//         res.status(200).json(products)
//     } catch (error) {
//         console.log("Error in getProducts")
//         console.log(error.message)
//         res.status(400).json({error:error.message})
//     }
// }

const getSingleProduct=async(req,res)=>{
    console.log(req.params)
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
        const { category, minPrice, maxPrice, gender, search, page = 1, pageSize = 4 } = req.query;
        const { sellerId } = req.body;
    
        // Calculating the number of documents to skip and limit
        const skip = (Number(page) - 1) * Number(pageSize);
        const limit = Number(pageSize);
    
        // Building filter object based on provided parameters
        const filter = {};
        if (sellerId) filter.sellerId = sellerId;
        if (category) filter.category = category;
        if (gender) filter.gender = gender;
        if (search) {
            filter.$name = { $search: search };
        }
    
        // Handling the price range
        if (minPrice && maxPrice) {
            filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
        } else if (minPrice) {
            filter.price = { $gte: Number(minPrice) };
        } else if (maxPrice) {
            filter.price = { $lte: Number(maxPrice) };
        }
    
        // Counting total number of products for the given filter
        const totalCount = await Product.countDocuments(filter);
    
        // Querying the database with the constructed filter, skip, and limit
        const filteredProducts = await Product.find(filter)
            .skip(skip)
            .limit(limit);
    
        res.status(200).json({ 
            data: filteredProducts, 
            total: totalCount, 
            page, 
            limit 
        });
    } catch (error) {
        console.log("Error in getFilteredProducts");
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
}

const addProduct=async(req,res)=>{
    try {
        let {image1,image2}=req.body;
        if (image1) {
            const uploadedResponse = await cloudinary.uploader.upload(image1)
            image1 = uploadedResponse.secure_url
        }
        if(image2){
            const uploadedResponse = await cloudinary.uploader.upload(image2)
            image2 = uploadedResponse.secure_url
        }
        const newProduct=new Product({...req.body,image1,image2})
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
        const product=await Product.findOne({_id:id})
        if(product.sellerId==sellerId){
            if(product.image1){
                const imageId = product.image1.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(imageId)
            }
            if(product.image2){
                const imageId = product.image2.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(imageId)
            }
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

const getProducts=async(req,res)=>{
    try {
        const { category, minPrice, maxPrice, gender, search, page = 1, pageSize = 4 } = req.query;
    
        // Calculating the number of documents to skip and limit
        const skip = (Number(page) - 1) * Number(pageSize);
        const limit = Number(pageSize);
    
        // Building filter object based on provided parameters
        const filter = {};
        if (category) filter.category = category;
        if (gender) filter.gender = gender;
        if (search) {
            filter.$name = { $search: search };
        }
    
        // Handling the price range
        if (minPrice && maxPrice) {
            filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
        } else if (minPrice) {
            filter.price = { $gte: Number(minPrice) };
        } else if (maxPrice) {
            filter.price = { $lte: Number(maxPrice) };
        }
    
        // Counting total number of products for the given filter
        const totalCount = await Product.countDocuments(filter);
    
        // Querying the database with the constructed filter, skip, and limit
        const filteredProducts = await Product.find(filter)
            .skip(skip)
            .limit(limit);
    
        res.status(200).json({ 
            data: filteredProducts, 
            total: totalCount, 
            page, 
            limit 
        });
    } catch (error) {
        console.log("Error in getFilteredProducts");
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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