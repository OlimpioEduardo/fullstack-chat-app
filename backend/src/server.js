import express from "express";
import "dotenv/config"
import cors from "cors"

import path from "path";

import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from"./routes/message.route.js"
import { connectDb } from "./lib/db.js";
import {app, server} from "./lib/socket.js"




const PORT = process.env.PORT
const __dirname = path.resolve()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

connectDb() .then(()=>{
    server.listen(PORT, ()=>{
    console.log("Server is Running on port", PORT )
})
})

