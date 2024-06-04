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
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const ExamDateModel = mongoose.model("ExamDate", examDateSchema);

module.exports = ExamDateModel;
