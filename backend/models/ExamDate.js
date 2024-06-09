const mongoose = require('mongoose');

const examDateSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
  },
  examDate: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
    enum: ["morning", "afternoon"],
  },
 
});

const ExamDateModel = mongoose.model("ExamDate", examDateSchema);

module.exports = ExamDateModel;
