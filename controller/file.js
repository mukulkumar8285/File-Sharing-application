const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const FileModel = require("../models/file");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
    pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
  },
});

const uploadDirectoryPath = path.join(__dirname, "..", "files");
console.log(uploadDirectoryPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectoryPath);
  },
  filename: (req, file, cb) => {
    const fileName = uuidv4() + path.extname(file.originalname);
    console.log(fileName);
    // const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9)+ path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
}).single("file"); // Error: Ensure the field name matches the one from your form

const uploadfile = async (req, res) => {
  upload(req, res, async (error) => {
    // Issue: Accessing req.body here won't contain form fields if using multer to handle file uploads
    console.log(req.body);
    if (error) {
      console.log("Error occurred during upload: ", error);
      // Issue: Sending error response to the client
      res.status(500).json({
        success: false,
        message: "Error occurred during upload",
      });
      return;
    }
    //file save here
    const newfile = new FileModel({
      originalfilename: req.file.originalname,
      newfilename: req.file.filename,
      path: req.file.path,
    });

    const newInsertedfile = await newfile.save();
    console.log(req.file);
    console.log("File uploaded successfully");
    res.json({
      success: true,
      message: "File uploaded successfully",
      fileId: newInsertedfile._id,
    });
  });
};
const genratedyanmiclink = async (req, res) => {
  try{
  const fileiId = req.params.uuid;
  console.log(fileiId);
  // console.log(req.body);
  const file = await FileModel.findById(fileiId);

  if(!file){
    return res.status(404).json({success:false,message:"File not found"})
  }
  console.log(file);
  res.status(404).json({
    success: true,
    message: "Link Genrate Successfully",
    result : "http://localhost:8080/files/download/" + fileiId,
  });
}
catch(error){
  console.log(error);
  res.status(404).json({
    success: false,
    massage:"file not found1",
  })
}
}
const downlaodfile = async (req, res) => {
  try {
    const fileId = req.params.uuid;
    console.log(fileId);
    
    const file = await FileModel.findById(fileId);

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    console.log(file.path , file.originalfilename);
    res.download(file.path  ,file.originalfilename);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while downloading the file",
    });
  }
};


const sendfile = async (req, res) => {
  console.log(req.body);
const {fileId , shareTo} = req.body;
const downloadlink = "http://localhost:8080/files/download/" + fileId;
const info = await transporter.sendMail({
  from: 'do-not-reply@gmail.com', // sender address
  to: shareTo, // list of receivers
  subject: "Hello ✔", // Subject line
  
  html:`<html>
  <head>
  </head>
  <body>
  <p>Hello How Are You</p>
  <a href=${downloadlink}>click To Download</a>
  </body></html>` // plain text body
 
});

  res.json({
    success: true,
    message: "File Send Successfully",
  });
};

const filecontroller = {
  uploadfile,
  genratedyanmiclink,
  downlaodfile,
  sendfile,
};

module.exports = filecontroller;
