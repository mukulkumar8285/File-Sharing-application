const express = require("express");

const fileRoute = require("./Routes/file");
const mongoose = require("mongoose");


const app = express();
app.use(express.json()); //To recive the data in json
mongoose.connect("mongodb://localhost:27017/filesharing")
.then(()=> console.log("connection successful"))
.catch((err)=> console.log("Error of Server Connection" , err));

app.use(fileRoute);
app.listen(8080 , ()=>{
    console.log("App is starting ")
})