const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const cors = require("cors");
const UserModel = require("./models/Users");
const examDateModel = require("./models/ExamDate");
const AssignmentModel = require("./models/Assign");
const path=require('path');

const fs = require('fs');
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


// fetch faculty names based on department from JSON files
app.get('/api/faculty-files', (req, res) => {
  const { department } = req.query;

  if (!department) {
    return res.status(400).json({ error: 'Department parameter is required' });
  }

  const filename = `${department}.json`;
  const filePath = path.join(__dirname, 'faculty', filename);

  try {
    // Read the JSON file
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Extract faculty names and designations from the JSON content
    const facultyNameKey = `${department}_faculty_name`;
    const facultyDesignationKey = `${department}_faculty_designation`;

    const facultyName = content.map(item => ({
      name: item[facultyNameKey],
      }));

    res.json(facultyName);
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    res.status(500).json({ error: 'Error fetching faculty data' });
  }
});



//fetch faculty
app.get("/faculty", async (req, res) => {
  try {
    const facultyData = await UserModel.find().select("-password"); // exclude password field
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
    // await deleteAllAssignmentsOfFaculty(id); // Call the new endpoint
    res.status(200).json({ success: true, message: 'Faculty member deleted successfully.' });
  } catch (error) {
    console.error('Error deleting faculty member:', error);
    res.status(500).json({ success: false, message: 'Error deleting faculty member.' });
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
    await AssignmentModel.updateMany({ faculty: id }, { $set: { faculty: updatedFaculty } }).exec();
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
//checking for existing exam
app.get("/checkExamDate", async (req, res) => {
  try {
    const { examDate, semester, session } = req.query;
    const existingExam = await examDateModel.findOne({
      examDate,
      semester,
      session,
    });

    if (existingExam) {
      res.json(existingExam);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log("Error checking exam date", error);
    res.status(400).json({ message: "Error checking exam date." });
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
    // await deleteAllAssignmentsOfExamDate(id); // Call the new endpoint
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
    await AssignmentModel.updateMany({ date: id }, { $set: { date: updatedExamDate } }).exec();
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

// app.delete('/deleteAllAssignmentsOfFaculty/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const faculty = await UserModel.findById(id);

//     if (!faculty) {
//       return res.status(404).json({ success: false, message: 'Faculty not found.' });
//     }

//     await AssignmentModel.deleteMany({ facultyId: faculty._id }).exec();
//     res.status(200).json({ success: true, message: 'All assignments of the faculty deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting assignments of faculty:', error);
//     res.status(500).json({ success: false, message: 'Error deleting assignments of faculty.' });
//   }
// });

// // Delete all assignments of an exam date
// app.delete('/deleteAllAssignmentsOfExamDate/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await AssignmentModel.findByIdAndDelete({ examDateId: examDateId._id }).exec();
//     res.status(200).json({ success: true, message: 'All assignments of the exam date deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting assignments of exam date:', error);
//     res.status(500).json({ success: false, message: 'Error deleting assignments of exam date.' });
//   }
// });
// Route to handle assignment of duties

app.post('/assignDuty', async (req, res) => {
  try {
    const { examDateId, facultyId, session, semester, subject } = req.body;

    const newAssignment = new AssignmentModel({
      examDateId,
      facultyId,
      session,
      semester,
      subject,
    });

    await newAssignment.save();

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign duty', error });
  }
});


//fetch assigneddata

app.get("/assignedFaculty", async (req, res) => {
  try {
    const assignments = await AssignmentModel.find().populate('examDateId').populate('facultyId');
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assigned duty data:", error);
    res.status(500).json({ success: false, message: 'Error fetching assigned duty data', error: error.message });
  }
});
// New route to get assigned duties for a specific faculty
// app.get("/assignedFaculty/:facultyId", async (req, res) => {
//   try {
//     const { facultyId } = req.params;
//     const assignments = await AssignmentModel.find({ facultyId }).populate('examDateId');
//     res.status(200).json(assignments);
//   } catch (error) {
//     console.error("Error fetching assigned duty data:", error);
//     res.status(500).json({ success: false, message: 'Error fetching assigned duty data' });
//   }
// });
//logout feature
app.post('/logout', (req, res) => {
  // Here you might handle session destruction or token invalidation.
  res.status(200).json({ success: true, message: 'Logout successful' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
