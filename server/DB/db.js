import mongoose from "mongoose";
import { fetchSeedData } from "../controllers/product.controller.js";

const connectDB = async () => {
 try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB"); 
    fetchSeedData();
    
 } catch (error) {
    console.log(error.message);
    process.exit(1);
 } 
};
export default connectDB;
