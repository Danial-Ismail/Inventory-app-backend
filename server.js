const express=require("express");
const dotenv=require("dotenv").config();
const mongoose=require("mongoose");
const cookieParser = require("cookie-parser");
const userRoute=require("./routes/userRoutes")
const productRoute=require("./routes/productRoute");
const contactRoute=require("./routes/contactRoutes");
const cors=require("cors")
const bodyParser=require("body-parser");
const path=require("path");


const app=express()
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:3000"],credentials:true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/uploads",express.static(path.join(__dirname,"uploads")))

app.use("/api/users",userRoute);
app.use("/api/products",productRoute);
app.use("/api/contactus",contactRoute);

app.get("/", (req, res) => {
    res.send("Home Page");
});

const PORT=process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`)
    })
})
.catch((err)=>console.log(err))

