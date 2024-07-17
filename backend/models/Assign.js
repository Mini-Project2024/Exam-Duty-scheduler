const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  examDateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamDate',
    required: true,
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'examduty',
    required: true,
  },
  session: String,
  semester: String,
  subject: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'No Exchange'],
    
  },
});

const AssignmentModel = mongoose.model('Assignment', assignmentSchema);

module.exports = AssignmentModel;
