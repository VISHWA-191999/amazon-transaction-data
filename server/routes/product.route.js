import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
const productRouter = Router();

productRouter.get("/get-transactions", productController.getAllTransactions);
productRouter.get("/get-statistics", productController.getStatistics);
productRouter.get("/get-barChartData", productController.getBarChartData);
productRouter.get("/get-pieChartData", productController.getPieChartData);
productRouter.get("/get-combinedData", productController.getCombinedData);

export default productRouter;

