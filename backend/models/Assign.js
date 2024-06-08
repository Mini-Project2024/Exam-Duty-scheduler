const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

const AssignmentModel = mongoose.model("Assignment", assignmentSchema);

module.exports = AssignmentModel;
