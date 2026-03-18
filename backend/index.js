import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
let app=express();
app.listen(process.env.PORT,()=>{
console.log(`app is listening at ${process.env.PORT}`)
})