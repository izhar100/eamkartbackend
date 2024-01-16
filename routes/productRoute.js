const express=require("express");
const { addProduct, getProducts, getSellerProduct, updateProduct, deleteProduct,getSingleProduct } = require("../controllers/productController");
const { auth } = require("../middleware/auth");
const productRouter=express.Router()

productRouter.get("/",getProducts)
productRouter.get("/:id",getSingleProduct)
productRouter.get("/seller",auth,getSellerProduct)
productRouter.post("/add",auth,addProduct)
productRouter.put("/update/:id",auth,updateProduct)
productRouter.delete("/delete/:id",auth,deleteProduct)


module.exports={
    productRouter
}