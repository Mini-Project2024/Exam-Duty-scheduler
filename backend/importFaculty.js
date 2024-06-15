// importFaculty.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Faculty = require("./models/Users");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
  importData();
});

// Generate a random 6-character alphanumeric password
function generatePassword() {
  return Math.random().toString(36).slice(-6);
}

// Remove titles like "Mr.", "Ms.", "Dr.", or "Mrs." from the name
function removeTitle(name) {
  return name.replace(/^(Mr\.|Ms\.|Dr\.|Mrs\.)\s*/, "");
}

// Remove "Associate Professor & " from the designation
function cleanDesignation(designation) {
  return designation.replace(/^Associate Professor &\s*/, "");
}

// Read JSON files and save data to the database
async function importData() {
  const folderPath = path.join(__dirname, "faculty");
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileData = fs.readFileSync(filePath, "utf-8");
    const facultyData = JSON.parse(fileData);

    // Determine department from file name
    const dept = path.basename(file, path.extname(file)).toUpperCase();

    for (const faculty of facultyData) {
      const nameKey = `myadmin`;
      const designationKey = `Admin`;
      const nameWithTitle = faculty[nameKey];
      const designationWithPrefix = faculty[designationKey];
      const name = removeTitle(nameWithTitle);
      const designation = cleanDesignation(designationWithPrefix);

      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      const newFaculty = new Faculty({
        name: name,
        password: hashedPassword,
        dept: dept,
        designation: designation,
      });

      await newFaculty.save();
      console.log(
        `Saved ${name} to the database with dept ${dept} and designation ${designation}`
      );
    }
  }

  console.log("Import completed");
  mongoose.connection.close();
}
