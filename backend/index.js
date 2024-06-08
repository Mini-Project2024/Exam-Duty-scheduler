const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const cors = require("cors");
const UserModel = require("./models/Users");
const examDateModel = require("./models/ExamDate");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});


// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await UserModel.findOne({ name: username });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // User authenticated successfully
    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API routes
app.post("/addFaculty", async (req, res) => {
  try {
    const { name, email, password, dept } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newFaculty = new UserModel({ name, email, password: hashedPassword, dept });
    await newFaculty.save();
    res.json(newFaculty);
  } catch (error) {
    console.error("Error adding faculty:", error);
    res.status(400).json({ message: "Error adding faculty member." });
  }
});

//fetch faculty
app.get("/faculty", async (req, res) => {
  try {
    const facultyData = await UserModel.find();
    res.json(facultyData);
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    res.status(500).json({ message: "Error fetching faculty data." });
  }
});
app.delete('/deleteFaculty/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Faculty member deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting faculty member.' });
  }
});

app.put('/updateFaculty/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, dept } = req.body;
    console.log('Updating faculty details:', { id, name, email, password, dept });

    let updatedData = { name, email, dept };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedFaculty = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
    console.log('Updated faculty:', updatedFaculty);

    if (!updatedFaculty) {
      console.error('Faculty not found.');
      return res.status(404).json({ success: false, message: 'Faculty not found.' });
    }

    res.status(200).json({ success: true, message: 'Faculty details updated successfully.', data: updatedFaculty });
  } catch (error) {
    console.error('Error updating faculty details:', error);
    res.status(500).json({ success: false, message: 'Error updating faculty details.' });
  }
});
//Add date
app.post("/addExamdate", async (req, res) => {
  try {
    const examDate = new examDateModel(req.body);
    await examDate.save();
    res.json(examDate);
  } catch (error) {
    console.log("Error adding exam date", error);
    res.status(400).json({ message: "Error adding exam date." });
  }
});
//get date
app.get("/getExamDetails", async (req, res) => {
  try {
    const examData = await examDateModel.find();
    res.json(examData);
  } catch (err) {
    console.log("Error Fetching exam dates", error);
    res.status(500).json({ message: "Error fetching exam dates" });
  }
});

// Delete exam date
app.delete('/deleteExamDate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await examDateModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Exam details deleted successfully.' });
  } catch (error) {
    console.error('Error deleting exam details:', error);
    res.status(500).json({ success: false, message: 'Error deleting exam details.' });
  }
});


// Update exam date
app.put('/updateExamDate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { examName, examDate, session } = req.body;
    console.log('Updating exam details:', { id, examName, examDate, session });

    const updatedExam = await examDateModel.findByIdAndUpdate(id, { examName, examDate, session }, { new: true });
    console.log('Updated exam:', updatedExam);

    if (!updatedExam) {
      console.error('Exam not found.');
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    res.status(200).json({ success: true, message: 'Exam details updated successfully.', data: updatedExam });
  } catch (error) {
    console.error('Error updating exam details:', error);
    res.status(500).json({ success: false, message: 'Error updating exam details.' });
  }
});

//assign duty
// Add this code to your backend index.js file

const AssignmentModel = require("./models/Assign");

// Route to handle assignment of duties
app.post("/assignDuty", async (req, res) => {
  try {
    const { date, faculty, session } = req.body;
    
    // Create or update the assignment document
    const existingAssignment = await AssignmentModel.findOne({ date });

    if (existingAssignment) {
      // Update the existing assignment
      existingAssignment.faculty = faculty;
      existingAssignment.session = session;
      await existingAssignment.save();
    } else {
      // Create a new assignment document
      const newAssignment = new AssignmentModel({
        date,
        faculty,
        session,
      });
      await newAssignment.save();
    }

    res.status(200).json({ success: true, message: 'Duty assigned successfully' });
  } catch (error) {
    console.error("Error assigning duty:", error);
    res.status(500).json({ success: false, message: 'Error assigning duty' });
  }
});
//fetch assigneddata

app.get("/assignedFaculty", async (req, res) => {
  try {
    // Fetch all assigned faculty details from the database
    const assignedFaculty = await AssignmentModel.find();

    // Return the assigned faculty details as a response
    res.json(assignedFaculty);
  } catch (error) {
    console.error("Error fetching assigned faculty details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
