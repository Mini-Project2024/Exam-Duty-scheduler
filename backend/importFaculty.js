const mongoose = require("mongoose");
const Crypto = require("crypto");
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

var secret_key = 'fd85b494-aaaa';
var secret_iv = "smslt";
var encryptionMethod = 'AES-256-CBC';
var key = Crypto.createHash('sha512').update(secret_key, 'utf-8').digest('hex').substr(0,32);
var iv = Crypto.createHash('sha512').update(secret_iv, 'utf-8').digest('hex').substr(0,16);

function encrypt(plain_text, encryptionMethod, secret, iv){
  var encryptor = Crypto.createCipheriv(encryptionMethod, secret, iv);
  var aes_encrypted = encryptor.update(plain_text, 'utf-8', 'base64');
  aes_encrypted += encryptor.final('base64');
  return aes_encrypted;
}


function decrypt(message, encryptionMethod, secret, iv){
  const buff = Buffer.from(message, 'base64');
  encryptedMessage = buff.toString('utf-8');
  var decryptor = Crypto.createDecipheriv(encryptionMethod, secret, iv);
  return decryptor.update(message, 'base64', 'utf8') + decryptor.final('utf8');
}

// Read JSON files and save data to the database
async function importData() {
  const folderPath = path.join(__dirname, "faculty");
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileData = fs.readFileSync(filePath, "utf-8");
    const facultyData = JSON.parse(fileData);

    const dept = path.basename(file, path.extname(file)).toUpperCase();

    for (const faculty of facultyData) {
      const nameKey = `${dept.toLowerCase()}_faculty_name`;
      const designationKey = `${dept.toLowerCase()}_faculty_designation`;
      const nameWithTitle = faculty[nameKey];
      const designationWithPrefix = faculty[designationKey];
      const name = removeTitle(nameWithTitle);
      const designation = cleanDesignation(designationWithPrefix);

      const password = generatePassword();
      const encryptedPassword = encrypt(password, encryptionMethod, key, iv);

      const newFaculty = new Faculty({
        name: name,
        password: encryptedPassword, // Ensure this is correctly populated
        dept: dept,
        designation: designation,
      });

      console.log("New Faculty Object:", newFaculty); // Log the new faculty object

      try {
        await newFaculty.save();
        console.log(`Saved ${name} to the database with dept ${dept}`);
      } catch (error) {
        console.error(`Error saving ${name}:`, error);
      }
    }
  }

  console.log("Import completed");
  mongoose.connection.close();
}
