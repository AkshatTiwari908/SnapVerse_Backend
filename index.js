import dotenv from "dotenv";
dotenv.config(); 

import express from "express";


import {connectDb} from "./db/connectDb.js";

import authRoutes from "./routes/auth.route.js"

const app = express();
app.use(express.json());

const Port = process.env.PORT || 3000;



app.use("/api/auth", authRoutes)

app.listen(3000, () =>{
    connectDb();
    console.log("Server is running on port: ", Port);
});
