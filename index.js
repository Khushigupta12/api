const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors());
const dotenv = require("dotenv")
const mongoose = require("mongoose");
// last me image upload krne k lie multer or path require kia h 
const multer = require('multer')
const path = require("path")

// all routes
const authRoute = require("./routes/auth")
const authUser = require("./routes/user")
const authPost = require("./routes/posts")
const authCat = require("./routes/categories")

dotenv.config();
app.use(express.json())

app.use("/images", express.static(path.join(__dirname, "/images")));

// mongodb connection
mongoose.connect(process.env.CONNECTION_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log("Connected to MongoDB"))
.catch((err) => console.log(err))

// image upload krne k lie
const storage = multer.diskStorage({
  destination: (req, file, callb) => {
    callb(null, "images");
  },
  filename: (req, file, callb) => {
    //callb(null, "file.png")
    callb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use('/auth', authRoute)
app.use("/users", authUser)
app.use("/posts", authPost)
app.use("/category", authCat) 
//   app.use("/auth/register", require("./routes/auth/register"));
app.get("/", (req,res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.send("API is runningg...");
});

app.listen("5000", () => {
    console.log("backend running");
})
