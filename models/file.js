const mongoose = require("mongoose");


const fileSchema =new mongoose.Schema({
    originalfilename:{
        type:String,
    },
    newfilename:{
        type : String,
    },
    path:{
        type:String,
    },
})

const FileModel = mongoose.model("files",fileSchema);
module.exports = FileModel;