import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./DB/db.js";
import { fetchSeedData } from "./controllers/product.controller.js";
import productRouter from "./routes/product.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server is running on port ",port);
});

connectDB();


app.use("/api/product", productRouter);
