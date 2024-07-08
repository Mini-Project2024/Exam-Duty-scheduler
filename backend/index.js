const express = require("express");
const mongoose = require("mongoose");
const Crypto = require("crypto");
const cors = require("cors");
const UserModel = require("./models/Users");
const examDateModel = require("./models/ExamDate");
const AssignmentModel = require("./models/Assign");
const jwt = require("jsonwebtoken");
const passport = require("./passport.config.js");
const ExchangeRequest = require("./models/ExchangeReq.js");
const adminRoutes = require("./adminRoutes.js");
const ExcelJS = require("exceljs");
// const path = require("path");
// const fs = require("fs");
// const { isValidNumber } = require("face-api.js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Use admin routes
// app.use('/admin', adminRoutes);
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

var secret_key = "fd85b494-aaaa";
var secret_iv = "smslt";
var encryptionMethod = "AES-256-CBC";
var key = Crypto.createHash("sha512")
  .update(secret_key, "utf-8")
  .digest("hex")
  .substr(0, 32);
var iv = Crypto.createHash("sha512")
  .update(secret_iv, "utf-8")
  .digest("hex")
  .substr(0, 16);

function encrypt(plain_text, encryptionMethod, secret, iv) {
  var encryptor = Crypto.createCipheriv(encryptionMethod, secret, iv);
  var aes_encrypted = encryptor.update(plain_text, "utf-8", "base64");
  aes_encrypted += encryptor.final("base64");
  return aes_encrypted;
}

function decrypt(encryptedMessage, encryptionMethod, secret, iv) {
  try {
    let decryptor = Crypto.createDecipheriv(encryptionMethod, secret, iv);
    let decrypted = decryptor.update(encryptedMessage, "base64", "utf8");
    decrypted += decryptor.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Error decrypting:", error);
    return null; // Return null or handle the error appropriately
  }
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await UserModel.findOne({ name: username });

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare passwords
    const isMatch =
      password === decrypt(user.password, encryptionMethod, key, iv);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // User authenticated successfully, generate JWT
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Store the token in the user's document
    user.token = token;
    await user.save();

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// API routes
//generating excel file

// app.get('/generateExcel', async (req, res) => {
//   // Extract date range from query parameters
//   const from = req.query.from; // Example: '2024-06-01'
//   const to = req.query.to;     // Example: '2024-06-30'

//   // Example data (you can replace this with actual data retrieval based on the date range)
//   const exampleData = [
//     {
//       facultyName: 'John Doe',
//       dept: 'Computer Science',
//       subCode: 'CS101',
//       examName: 'Midterm Exam',
//       noOfDutiesCompleted: 5,
//       signature: ''
//     },
//     {
//       facultyName: 'Jane Smith',
//       dept: 'Mathematics',
//       subCode: 'MATH201',
//       examName: 'Final Exam',
//       noOfDutiesCompleted: 3,
//       signature: ''
//     }
//   ];

//   // Create a new workbook and add a worksheet
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Exam Duties');

//   // Add "Exam Details" in the first row
//   worksheet.addRow({ ExamDetails: `From ${from} to ${to}` });

//   // Add column headers
//   worksheet.columns = [
//     { header: 'Sl No', key: 'slNo', width: 10 },
//     { header: 'Faculty Name', key: 'facultyName', width: 20 },
//     { header: 'Department', key: 'dept', width: 20 },
//     { header: 'Subject Code', key: 'subCode', width: 15 },
//     { header: 'Exam Name', key: 'examName', width: 20 },
//     { header: 'No of Duties Completed', key: 'noOfDutiesCompleted', width: 20 },
//     { header: 'Signature', key: 'signature', width: 50 }
//   ];

//   // Add rows with the example data
//   exampleData.forEach((data, index) => {
//     worksheet.addRow({
//       slNo: index + 1,
//       facultyName: data.facultyName,
//       dept: data.dept,
//       subCode: data.subCode,
//       examName: data.examName,
//       noOfDutiesCompleted: data.noOfDutiesCompleted,
//       signature: data.signature
//     });
//   });

//   // Set headers for the response
//   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//   res.setHeader('Content-Disposition', 'attachment; filename=exam_duties.xlsx');

//   // Write the workbook to the response
//   await workbook.xlsx.write(res);
//   res.end();
// });

// app.get('/generateExcel', async (req, res) => {
//   try {
//     const { from, to } = req.query;

//     // Validate if from and to dates are provided
//     if (!from || !to) {
//       return res.status(400).json({ success: false, message: 'From and To dates are required' });
//     }

//     // Convert from and to dates to JavaScript Date objects
//     const fromDate = new Date(from);
//     const toDate = new Date(to);

//     // Fetch assignments within the date range with examDate details
//     const assignments = await AssignmentModel.find().populate({
//       path: 'examDateId',
//       match: {
//         examDate: {
//           $gte: fromDate.toISOString().split('T')[0],
//           $lte: toDate.toISOString().split('T')[0]
//         }
//       }
//     }).populate('facultyId');

//     // Filter out assignments where examDateId is null (i.e., no matching examDate)
//     const filteredAssignments = assignments.filter(assignment => assignment.examDateId);

//     // Group assignments by facultyId and consolidate work details
//     const assignmentCountByFaculty = filteredAssignments.reduce((acc, assignment) => {
//       const facultyId = assignment.facultyId?._id?.toString();
//       if (!facultyId) return acc;

//       if (!acc[facultyId]) {
//         acc[facultyId] = {
//           facultyName: assignment.facultyName,
//           dept: assignment.facultyId.dept,
//           subjectName: [],
//           subjectCodes: [],
//           examDates: [],
//           sessions: [],
//           semesters: [],
//           count: 0,
//         };
//       }
//       acc[facultyId].subjectCodes.push(assignment.subject);
//       acc[facultyId].examNames.push(assignment.examDateId.examName);
//       acc[facultyId].examDates.push(assignment.examDateId.examDate);
//       acc[facultyId].sessions.push(assignment.examDateId.session);
//       acc[facultyId].semesters.push(assignment.semester);
//       acc[facultyId].count += 1;
//       return acc;
//     }, {});

//     // Create Excel workbook
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Exam Duties');

//     // Add headers
//     worksheet.columns = [
//       { header: 'Sl No', key: 'slNo', width: 10 },
//       { header: 'Faculty Name', key: 'facultyName', width: 20 },
//       { header: 'Department', key: 'dept', width: 20 },
//       { header: 'Subject Name', key: 'subjectName', width: 30 },
//       { header: 'Subject Codes', key: 'subjectCodes', width: 30 },
//       { header: 'Exam Date', key: 'examDate', width: 20 },
//       { header: 'Session', key: 'session', width: 15 },
//       { header: 'Semester', key: 'semester', width: 15 },
//       { header: 'Number of Duties Completed', key: 'numberOfDuties', width: 30 },
//       { header: 'Signature', key: 'signature', width: 30 }
//     ];

//     // Make the first row bold and slightly larger
//     const headerRow = worksheet.getRow(1);
//     headerRow.height = 20; // Set header row height
//     headerRow.eachCell((cell) => {
//       cell.font = { bold: true, size: 14 };
//       cell.alignment = { vertical: 'middle', horizontal: 'center' };
//       cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' }
//       };
//     });

//     // Add rows with assignment data
//     let index = 1;
//     Object.values(assignmentCountByFaculty).forEach((assignment) => {
//       const row = worksheet.addRow({
//         slNo: index++,
//         facultyName: assignment.facultyName,
//         dept: assignment.dept,
//         subjectCodes: assignment.subjectCodes.join('\n'),
//         examDate: assignment.examDates.join('\n'),
//         session: assignment.sessions.join('\n'),
//         semester: assignment.semesters.join('\n'),
//         numberOfDuties: assignment.count,
//         signature: ''
//       });

//       row.height = 40; // Set the same height for all data rows

//       // Set the alignment to wrap text and center-align, and add borders
//       row.eachCell({ includeEmpty: true }, (cell) => {
//         cell.alignment = { wrapText: true, vertical: 'top', horizontal: 'center' };
//         cell.border = {
//           top: { style: 'thin' },
//           left: { style: 'thin' },
//           bottom: { style: 'thin' },
//           right: { style: 'thin' }
//         };
//       });
//     });

//     // Set headers for the response
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=exam_duties.xlsx');

//     // Write workbook to response
//     await workbook.xlsx.write(res);
//     res.end();

//   } catch (error) {
//     console.error('Error generating Excel:', error);
//     res.status(500).json({ success: false, message: 'Failed to generate Excel' });
//   }
// });

app.get("/generateExcel", async (req, res) => {
  try {
    const { from, to } = req.query;

    // Validate if from and to dates are provided
    if (!from || !to) {
      return res
        .status(400)
        .json({ success: false, message: "From and To dates are required" });
    }

    // Convert from and to dates to JavaScript Date objects
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Fetch assignments within the date range with examDate details
    const assignments = await AssignmentModel.find()
      .populate({
        path: "examDateId",
        match: {
          examDate: {
            $gte: fromDate.toISOString().split("T")[0],
            $lte: toDate.toISOString().split("T")[0],
          },
        },
      })
      .populate("facultyId");

    // Filter out assignments where examDateId is null (i.e., no matching examDate)
    const filteredAssignments = assignments.filter(
      (assignment) => assignment.examDateId
    );

    // Group assignments by facultyId and consolidate work details
    const assignmentCountByFaculty = filteredAssignments.reduce(
      (acc, assignment) => {
        const facultyId = assignment.facultyId?._id?.toString();
        if (!facultyId) return acc;

        if (!acc[facultyId]) {
          acc[facultyId] = {
            facultyName: assignment.facultyName,
            dept: assignment.facultyId.dept,
            subjectNames: [],
            subjectCodes: [],
            examDates: [],
            sessions: [],
            semesters: [],
            count: 0,
          };
        }
        acc[facultyId].subjectNames.push(assignment.subject);
        acc[facultyId].subjectCodes.push(assignment.examDateId.subjectcode);
        acc[facultyId].examDates.push(assignment.examDateId.examDate);
        acc[facultyId].sessions.push(assignment.examDateId.session);
        acc[facultyId].semesters.push(assignment.semester);
        acc[facultyId].count += 1;
        return acc;
      },
      {}
    );

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Exam Duties");

    // Add headers
    worksheet.columns = [
      { header: "Sl No", key: "slNo", width: 10 },
      { header: "Faculty Name", key: "facultyName", width: 20 },
      { header: "Department", key: "dept", width: 20 },
      { header: "Subject Name", key: "subjectName", width: 30 },
      { header: "Subject Codes", key: "subjectCodes", width: 30 },
      { header: "Exam Date", key: "examDate", width: 20 },
      { header: "Session", key: "session", width: 15 },
      { header: "Semester", key: "semester", width: 15 },
      {
        header: "No. of Duties Completed",
        key: "numberOfDuties",
        width: 30,
      },
      { header: "Signature", key: "signature", width: 30 },
    ];

    // Make the first row bold and slightly larger
    const headerRow = worksheet.getRow(1);
    headerRow.height = 20; // Set header row height
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 14 };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add rows with assignment data
    let index = 1;
    Object.values(assignmentCountByFaculty).forEach((assignment) => {
      const row = worksheet.addRow({
        slNo: index++,
        facultyName: assignment.facultyName,
        dept: assignment.dept,
        subjectName: assignment.subjectNames.join("\n"),
        subjectCodes: assignment.subjectCodes.join("\n"),
        examDate: assignment.examDates.join("\n"),
        session: assignment.sessions.join("\n"),
        semester: assignment.semesters.join("\n"),
        numberOfDuties: assignment.count,
        signature: "",
      });

      row.height = 40; // Set the same height for all data rows

      // Set the alignment to wrap text and center-align, and add borders
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = {
          wrapText: true,
          vertical: "top",
          horizontal: "center",
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Set headers for the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=exam_duties.xlsx"
    );

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate Excel" });
  }
});

app.post("/addFaculty", async (req, res) => {
  try {
    const { name, designation, password, dept } = req.body;

    // Encrypt the password
    const encryptedPassword = encrypt(password, encryptionMethod, key, iv);

    const newFaculty = new UserModel({
      name,
      designation,
      password: encryptedPassword,
      dept,
    });

    await newFaculty.save();
    res.json(newFaculty);
  } catch (error) {
    console.error("Error adding faculty:", error);
    res.status(400).json({ message: "Error adding faculty member." });
  }
});

// Fetch faculty with decryption
app.get("/faculty", async (req, res) => {
  try {
    const facultyData = await UserModel.find();

    const decryptedFacultyData = facultyData.map((faculty) => {
      const encryptedPassword = faculty.password;

      // Decrypt the password
      const decryptedPassword = decrypt(
        encryptedPassword,
        encryptionMethod,
        key,
        iv
      );

      return {
        ...faculty.toObject(),
        password: decryptedPassword,
      };
    });

    res.json(decryptedFacultyData);
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    res.status(500).json({ message: "Error fetching faculty data." });
  }
});

// Delete faculty member
app.delete("/deleteFaculty/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Delete the faculty member
    await UserModel.findByIdAndDelete(id);

    // Delete assignments associated with this faculty
    await AssignmentModel.deleteMany({ facultyId: id });

    res.status(200).json({
      success: true,
      message:
        "Faculty member and associated assignments deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting faculty member:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting faculty member and associated assignments.",
    });
  }
});

// Update faculty member
app.put("/updateFaculty/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, password, dept } = req.body;

    let updatedData = { name, designation, dept };

    if (password) {
      const encryptedPassword = encrypt(password);
      updatedData.password = encryptedPassword;
    }

    const updatedFaculty = await UserModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    console.log("Updated faculty:", updatedFaculty);

    if (!updatedFaculty) {
      console.error("Faculty not found.");
      return res
        .status(404)
        .json({ success: false, message: "Faculty not found." });
    }

    res.status(200).json({
      success: true,
      message: "Faculty details updated successfully.",
      data: updatedFaculty,
    });
  } catch (error) {
    console.error("Error updating faculty details:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating faculty details." });
  }
});

// Add exam date
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

// Checking for existing exam
app.get("/checkExamDate", async (req, res) => {
  try {
    const { examDate, subjectcode, semester, session } = req.query;
    const existingExam = await examDateModel.findOne({
      examDate,
      subjectcode,
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

// Get exam details
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
app.delete("/deleteExamDate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await examDateModel.findByIdAndDelete(id);

    // Delete assignments associated with this exam date
    await AssignmentModel.deleteMany({ examDateId: id });
    res
      .status(200)
      .json({ success: true, message: "Exam details deleted successfully." });
  } catch (error) {
    console.error("Error deleting exam details:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting exam details." });
  }
});

// Update exam date
app.put("/updateExamDate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { examName, subjectcode, examDate, session } = req.body;
    console.log("Updating exam details:", {
      id,
      examName,
      subjectcode,
      examDate,
      session,
    });

    const updatedExam = await examDateModel.findByIdAndUpdate(
      id,
      { examName, subjectcode, examDate, session },
      { new: true }
    );
    await AssignmentModel.updateMany(
      { date: id },
      { $set: { date: examDate } }
    ).exec();
    console.log("Updated exam:", updatedExam);

    if (!updatedExam) {
      console.error("Exam not found.");
      return res
        .status(404)
        .json({ success: false, message: "Exam not found." });
    }

    res.status(200).json({
      success: true,
      message: "Exam details updated successfully.",
      data: updatedExam,
    });
  } catch (error) {
    console.error("Error updating exam details:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating exam details." });
  }
});

// Assign duty
app.post("/assignDuty", async (req, res) => {
  try {
    const { examDateId, facultyId, facultyName, session, semester, subject } =
      req.body;

    const newAssignment = new AssignmentModel({
      examDateId,
      facultyId,
      facultyName,
      session,
      semester,
      subject,
    });

    await newAssignment.save();

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to assign duty", error });
  }
});

// Fetch assigned data
app.get("/assignedFaculty", async (req, res) => {
  try {
    const assignments = await AssignmentModel.find()
      .populate({
        path: "examDateId",
        select: [
          "_id",
          "examDate",
          "subjectcode",
          "examName",
          "semester",
          "session",
        ],
      })
      .populate({
        path: "facultyId",
        select: ["_id", "name"],
      });

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assigned duty data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assigned duty data",
      error: error.message,
    });
  }
});
//fetch faculty details
app.get(
  "/assignedFaculty/me",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        throw new Error("User not authenticated");
      }
      const facultyName = req.user.name; // Get the username from the authenticated user
      // console.log("Authenticated user:", req.user); // Add this line for debugging
      const assignments = await AssignmentModel.find({
        facultyName: facultyName,
      })
        .populate({
          path: "examDateId",
          select: [
            "_id",
            "examDate",
            "subjectcode",
            "examName",
            "semester",
            "session",
          ],
        })
        .populate({
          path: "facultyId",
          select: ["_id", "name"],
        });

      res.status(200).json(assignments);
    } catch (error) {
      console.error("Error fetching assigned duty data:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching assigned duty data",
        error: error.message,
      });
    }
  }
);

// ------------------------------------------- demo work ---------------------------------------------

// New route to get distinct exam dates with faculties
app.get(
  "/distinctExamDates",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const assignments = await AssignmentModel.find()
        .populate({
          path: "examDateId",
          select: ["_id", "examDate", "examName"],
        })
        .populate({
          path: "facultyId",
          select: ["_id", "name"],
        });

      // Group by examDateId and gather faculty names
      const groupedByDate = assignments.reduce((acc, assignment) => {
        const { examDateId, facultyId } = assignment;
        const dateKey = examDateId._id;
        if (!acc[dateKey]) {
          acc[dateKey] = {
            examDate: examDateId.examDate,
            examName: examDateId.examName,
            faculties: new Set(),
          };
        }
        acc[dateKey].faculties.add(facultyId.name);
        return acc;
      }, {});

      // Convert sets to arrays and remove duplicate dates
      const distinctDates = Object.values(groupedByDate).map((item) => ({
        examDate: item.examDate,
        examName: item.examName,
        faculties: Array.from(item.faculties),
      }));

      res.json(distinctDates);
    } catch (error) {
      console.error("Error fetching distinct exam dates:", error);
      res
        .status(500)
        .json({
          message: "Error fetching distinct exam dates",
          error: error.message,
        });
    }
  }
);

// ------------------------------------------------------------------------------------------------------

// Exchange duty route
app.get(
  "/exchangeDuty",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        throw new Error("User not authenticated");
      }
      const facultyName = req.user.name; // Get the username from the authenticated user
      // console.log("Authenticated user:", req.user); // Add this line for debugging
      const assignments = await AssignmentModel.find({
        facultyName: facultyName,
      })
        .populate({
          path: "examDateId",
          select: ["_id", "examDate", "examName", "semester", "session"],
        })
        .populate({
          path: "facultyId",
          select: ["_id", "name"],
        });

      res.status(200).json(assignments);
    } catch (error) {
      console.error("Error fetching assigned duty data:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching assigned duty data",
        error: error.message,
      });
    }
  }
);

// Route to handle duty exchange request
// app.post('/requestExchange/:assignmentId', passport.authenticate('jwt', { session: false }), async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     const { exchangeDateId, exchangeFacultyId, exchangeSession } = req.body;
//     const userId = req.user.id;

//     const userAssignment = await AssignmentModel.findById(assignmentId);
//     const exchangeAssignment = await AssignmentModel.findOne({
//       facultyId: exchangeFacultyId,
//       examDateId: exchangeDateId,
//       session: exchangeSession,
//     });

//     if (!userAssignment || !exchangeAssignment) {
//       return res.status(404).json({ message: 'Assignment not found' });
//     }

//     // Swap the assignments
//     const tempDateId = userAssignment.examDateId;
//     const tempFacultyId = userAssignment.facultyId;
//     const tempSession = userAssignment.examDateId.session;

//     userAssignment.examDateId = exchangeAssignment.examDateId;
//     userAssignment.facultyId = exchangeAssignment.facultyId;
//     userAssignment.examDateId.session = exchangeAssignment.session;

//     exchangeAssignment.examDateId = tempDateId;
//     exchangeAssignment.facultyId = tempFacultyId;
//     exchangeAssignment.session = tempSession;

//     await userAssignment.save();
//     await exchangeAssignment.save();

//     res.json({ message: 'Exchange successful' });
//   } catch (err) {
//     console.error('Failed to request exchange:', err);
//     res.status(500).json({ message: 'Failed to request exchange', error: err.message });
//   }
// });

app.post(
  "/requestExchange/:assignmentId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const { exchangeDateId, exchangeFacultyId, exchangeSession } = req.body;
      const userId = req.user.id;

      // Ensure the IDs are valid ObjectId types
      if (
        !mongoose.Types.ObjectId.isValid(assignmentId) ||
        !mongoose.Types.ObjectId.isValid(exchangeDateId) ||
        !mongoose.Types.ObjectId.isValid(exchangeFacultyId)
      ) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const userAssignment = await AssignmentModel.findById(assignmentId);
      const exchangeAssignment = await AssignmentModel.findOne({
        facultyId: exchangeFacultyId,
        examDateId: exchangeDateId,
        session: exchangeSession,
      });

      if (!userAssignment || !exchangeAssignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      // Create exchange request
      const exchangeRequest = new ExchangeRequest({
        originalAssignment: userAssignment._id,
        exchangeDateId,
        exchangeFacultyId,
        exchangeSession,
        status: "Pending", // Initial status is pending
      });

      await exchangeRequest.save();

      res.json({ message: "Exchange request submitted successfully" });
    } catch (err) {
      console.error("Failed to request exchange:", err);
      res
        .status(500)
        .json({ message: "Failed to request exchange", error: err.message });
    }
  }
);

// Get all exchange requests (for admin)
app.get("/admin/exchangeRequestslist", async (req, res) => {
  try {
    const exchangeRequests = await ExchangeRequest.find()
      .populate({
        path: "originalAssignment",
        populate: {
          path: "examDateId",
          select: ["_id", "examDate", "examName", "session"],
        },
      })
      .populate({
        path: "exchangeFacultyId",
        select: ["_id", "name"],
      })
      .populate({
        path: "exchangeDateId",
      })
      .exec();

    // Filter out any requests with missing originalAssignment or examDateId
    const filteredRequests = exchangeRequests.filter(
      (request) =>
        request.originalAssignment && request.originalAssignment.examDateId
    );

    res.json(filteredRequests);
  } catch (error) {
    console.error("Error fetching exchange requests:", error);
    res
      .status(500)
      .json({
        message: "Error fetching exchange requests",
        error: error.message,
      });
  }
});

const updateAssignmentFaculty = async (assignmentId, newFacultyId) => {
  const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
    assignmentId,
    { facultyId: newFacultyId },
    { new: true }
  );

  return updatedAssignment;
};

app.put("/admin/approveExchangeRequest/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find the exchange request and populate the required fields
    const exchangeRequest = await ExchangeRequest.findById(requestId)
      .populate({
        path: "originalAssignment",
        populate: {
          path: "facultyId",
          model: "examduty",
        },
      })
      .populate({
        path: "exchangeFacultyId",
        model: "examduty",
      })
      .populate({
        path: "exchangeDateId",
        model: "ExamDate",
      });

    if (!exchangeRequest) {
      return res.status(404).json({ message: "Exchange request not found" });
    }

    // Extract the details from the exchange request
    const originalAssignment = exchangeRequest.originalAssignment;
    const exchangeFaculty = exchangeRequest.exchangeFacultyId;
    const exchangeDate = exchangeRequest.exchangeDateId;
    const exchangeSession = exchangeRequest.exchangeSession;

    // Find the assignment for the exchange faculty on the specified date and session
    const exchangeAssignment = await AssignmentModel.findOne({
      examDateId: exchangeDate._id,
      session: exchangeSession,
      facultyId: exchangeFaculty._id,
    });

    if (!exchangeAssignment) {
      return res.status(404).json({ message: "Exchange assignment not found" });
    }

    // Temporary variables to store the faculty details
    const originalFacultyId = originalAssignment.facultyId;
    const originalFacultyName = originalAssignment.facultyName;
    const exchangeFacultyId = exchangeFaculty._id;
    const exchangeFacultyName = exchangeFaculty.name;

    // Swap the faculty IDs and names
    originalAssignment.facultyId = exchangeFacultyId;
    originalAssignment.facultyName = exchangeFacultyName;
    exchangeAssignment.facultyId = originalFacultyId;
    exchangeAssignment.facultyName = originalFacultyName;

    // Save the changes
    await originalAssignment.save();
    await exchangeAssignment.save();

    // Update the exchange request status to 'Approved'
    exchangeRequest.status = "Approved";
    await exchangeRequest.save();

    res.json({
      message: "Exchange request approved successfully",
      data: exchangeRequest,
    });
  } catch (error) {
    console.error("Error approving exchange request:", error);

    const { requestId } = req.params;
    const exchangeRequest = await ExchangeRequest.findById(requestId);

    if (exchangeRequest && exchangeRequest.status === "Pending") {
      exchangeRequest.status = "Rejected";
      await exchangeRequest.save();
    }

    res
      .status(500)
      .json({
        message: "Error approving exchange request",
        error: error.message,
      });
  }
});

// Approve exchange request
// app.put('/approveExchangeRequest/:requestId', async (req, res) => {
//   try {
//     const { requestId } = req.params;

//     const exchangeRequest = await ExchangeRequest.findByIdAndUpdate(requestId, { status: 'Approved' }, { new: true });

//     if (!exchangeRequest) {
//       return res.status(404).json({ message: 'Exchange request not found' });
//     }

//     // Perform additional actions if needed (e.g., update assignments)

//     res.json({ message: 'Exchange request approved successfully', data: exchangeRequest });
//   } catch (error) {
//     console.error('Error approving exchange request:', error);
//     res.status(500).json({ message: 'Error approving exchange request', error: error.message });
//   }
// });

// // Reject exchange request
app.put("/admin/rejectExchangeRequest/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;

    const exchangeRequest = await ExchangeRequest.findByIdAndUpdate(
      requestId,
      { status: "Rejected" },
      { new: true }
    );

    if (!exchangeRequest) {
      return res.status(404).json({ message: "Exchange request not found" });
    }

    res.json({
      message: "Exchange request rejected successfully",
      data: exchangeRequest,
    });
  } catch (error) {
    console.error("Error rejecting exchange request:", error);
    res
      .status(500)
      .json({
        message: "Error rejecting exchange request",
        error: error.message,
      });
  }
});

// Logout feature
app.post("/logout", (req, res) => {
  res.status(200).json({ success: true, message: "Logout successful" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
