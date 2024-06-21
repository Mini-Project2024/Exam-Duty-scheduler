const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema({
  requestingUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestingUserName: {
    type: String,
    required: true,
  },
  requestedDateId: {
    type: Date,
    required: true,
  },
  requestedSession: {
    type: String,
    required: true,
  },
  requestedExchangeDateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamDate',
    required: true,
  },
 
  requestedExchangeFacultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestedExchangeSession: {
    type: String,
    required: true,
  },
 
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema);

module.exports = ExchangeRequest;
