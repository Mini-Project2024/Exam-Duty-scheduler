const express = require("express");
const path=require('path');
const mongoose = require("mongoose");
const cors = require("cors");

const UserModel = require("./models/Users");
const examDateModel=require("./models/ExamDate");

require("dotenv").config();

const app = express();

app.use(cors()); //Cross Origin Resource sharing
app.use(express.json()); //frontend to json format


//mongodb connection
mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});




app.post("/addFaculty", async (req, res) => {
    try {
      const newFaculty = new UserModel(req.body); // Create a new user model instance
      await newFaculty.save(); // Save the new faculty member to the database
      res.json(newFaculty); // Send the newly created faculty data back to frontend
    } catch (error) {
      console.error("Error adding faculty:", error);
      res.status(400).json({ message: "Error adding faculty member." });
    }
  });

app.get("/faculty", async (req, res) => {
    try {
      const facultyData = await UserModel.find(); // Find all faculty members from the database
      res.json(facultyData); // Send the faculty data to frontend
    } catch (error) {
      console.error("Error fetching faculty data:", error);
      res.status(500).json({ message: "Error fetching faculty data." });
    }
  });


app.post("/addExamdate",async(req,res)=>{
  try{
    const examDate=new examDateModel(req.body);
    await examDate.save();
    res.json(examDate);
  }catch(error){
    console.log("Error adding exam date",error);
    res.status(400).json({message:"Error adding exam date."});
  }
});

app.get("/getExamDetails",async(req,res)=>{
  try{
    const examData=await examDateModel.find();
    res.json(examData);
  }catch(err){
    console.log("Error Fetching exam dates",error);
    res.status(500).json({message:"Error fetching exam dates"});
  }
})
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
