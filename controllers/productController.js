const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, quantity, price, description } = req.body;

    if (!name || !sku || !category || !quantity || !price || !description) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }
  
    cloudinary.config({ 
        cloud_name: 'dwsqfdvlf', 
        api_key: '735355465191797', 
        api_secret: 'FEN64rjbQAyaKziVmtzwVWgb-Nk',
        secure: true
      });

    let fileData = {};
    if (req.file) {
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "Inventory app",
                resource_type: "image",
            
            });
            console.log(req.file);
        } catch (error) {
            console.log(error);
            res.status(500);
            throw new Error("Image could not be uploaded");
        }
        fileData={
            fileName:req.file.originalname,
            filePath:uploadedFile.secure_url,
            fileType:req.file.mimetype,
            fileSize:fileSizeFormatter(req.file.size,2)
        };
    }
   console.log(fileData)
    const product=await Product.create({
        user:req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image:fileData
    })

    res.status(201).json(product);
})

const updateProduct=asyncHandler(async(req,res)=>{
const {name,category,quantity,price,description}=req.body;
const{id}=req.params;

const product=await Product.findById(id);

if(!product){
    res.status(404)
    throw new Error("Product not found");
}
if(product.user.toString()!==req.user.id){
    res.status(401);
    throw new Error ("User not authorized");
}
let fileData = {};
    if (req.file) {
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "Inventory app",
                resource_type: "image",
            });
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }
        fileData={
            fileName:req.file.originalname,
            filePath:uploadedFile.secure_url,
            fileType:req.file.mimetype,
            fileSize:fileSizeFormatter(req.file.size,2)
        };
    }

    const updatedProduct=await Product.findByIdAndUpdate(
        {_id:id},
        {
            name,
            category,
            quantity,
            price,
            description,
            image:Object.keys(fileData).length===0?product?.image:fileData,
        },
        {
            new:true,
            runValidators:true,
        }
    )
    res.status(200).json(updatedProduct);
})

const getProducts=asyncHandler(async(req,res)=>{
const products=await Product.find({user:req.user.id}).sort("-createdAt");
res.status(200).send(products);
})

const getProduct=asyncHandler(async(req,res)=>{
  const product=await Product.findById(req.params.id);

  if(!product){
    res.status(400)
    throw new Error ("Product not found");
  }

  if(product.user.toString()!==req.user.id){
    res.status(401);
    throw new Error ("User not authorized");
  }
res.status(200).json(product);
});

const deleteProduct=asyncHandler(async(req,res)=>{
      const product=await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Product deleted"})
      if(!product){
        res.status(404);
        throw new Error("Product not found");
      }
    })
module.exports = { createProduct,updateProduct,getProducts,getProduct,deleteProduct };