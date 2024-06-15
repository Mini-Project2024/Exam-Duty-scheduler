// models/Faculty.js

const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  dept: { type: String, required: true },
  designation: { type: String, required: true },
});

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
