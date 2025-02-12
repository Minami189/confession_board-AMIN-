import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/routes.js";

const app = express();
const corsOptions = {
    origin: process.env.FRONTENDURL,  
    methods: "GET, POST, PUT, OPTIONS",    
    credentials: true,                
    allowedHeaders: ["Content-Type", "Authorization"],   
};
app.use(cors(corsOptions));
app.use(router);




app.listen(process.env.PORT || 5000);