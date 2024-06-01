const express = require("express");

const filecontroller = require("../controller/file");

const Route = express.Router();


Route.post("/api/files/",filecontroller.uploadfile)
Route.get("/files/:uuid", filecontroller.genratedyanmiclink)
Route.get("/files/download/:uuid", filecontroller.downlaodfile)
Route.post("/api/files/send", filecontroller.sendfile)


module.exports= Route;/files/