const { Product } = require("../models/productModel");

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

const getProducts=async(req,res)=>{
    console.log(req.query)
    try {
        const { category, minPrice, maxPrice, gender, search, page = 1, pageSize = 10 } = req.query;

        // Calculating the number of documents to skip and limit
        const skip = (Number(page) - 1) * Number(pageSize);
        const limit = Number(pageSize);

        if(!category && !minPrice && !maxPrice && !gender && !search){
            const data = await Product.find().skip(skip).limit(limit)
            return res.status(200).json(data)
        }
    
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
    
        // Querying the database with the constructed filter, skip, and limit
        const filteredProducts = await Product.find(filter)
          .skip(skip)
          .limit(limit);
        res.status(200).json(filteredProducts);
      } catch (error) {
        console.log("Error in getFilteredProducts")
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