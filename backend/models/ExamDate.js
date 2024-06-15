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
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
});

// Middleware to handle cascading delete for examDate
examDateSchema.pre('remove', async function(next) {
  try {
    await mongoose.model('Assignment').deleteMany({ examDateId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});


const ExamDateModel = mongoose.model("ExamDate", examDateSchema);

module.exports = ExamDateModel;
