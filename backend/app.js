import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from './routes/authRoutes.js'
import globalErrorHandler from "./controllers/errorController.js";
dotenv.config();
const app = express();
app.use(express.json());
const DB = process.env.DB;
mongoose
  .connect(DB)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Database Connection Failed", err.message);
  });
app.use('/api/auth', authRoutes);
app.use(globalErrorHandler);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
