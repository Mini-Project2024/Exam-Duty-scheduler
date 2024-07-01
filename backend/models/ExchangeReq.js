const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema({
  originalAssignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment', // Reference to Assignment model
    required: true,
  },
  exchangeDateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamDate', // Reference to ExamDate model
    required: true,
  },
  exchangeFacultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'examduty',
    required: true,
  },
  exchangeSession: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
});

const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema);

module.exports = ExchangeRequest;
