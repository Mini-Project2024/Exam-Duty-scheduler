const express = require('express');
const app = express.Router();
const ExchangeRequest = require('./models/ExchangeReq');
const Assignment = require('./models/Assign');
// Get all exchange requests (for admin)
app.get('/exchangeRequestslist', async (req, res) => {
  
  try {
    // if (!req.user) {
    //   return res.status(401).json({ message: 'User not authenticated' });
    // }
    const exchangeRequests = await ExchangeRequest.find()
      .populate({
        path: 'originalAssignment',
        populate: {
          path: 'examDateId',
          select: ['_id', 'examDate', 'examName','session'],
        },
      })
      .populate({
        path: 'exchangeFacultyId',
        select: ['_id', 'name'],
      })
      .populate({
        path:'exchangeDateId'
      })
      .exec();
      
    res.json(exchangeRequests);
    console.log(exchangeRequests);
  } catch (error) {
    console.error('Error fetching exchange requests:', error);
    res.status(500).json({ message: 'Error fetching exchange requests', error: error.message });
  }
});

// Approve exchange request
 // Make sure to import your Assignment model




// Reject exchange request
app.put('/rejectExchangeRequest/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const exchangeRequest = await ExchangeRequest.findByIdAndUpdate(requestId, { status: 'Rejected' }, { new: true });

    if (!exchangeRequest) {
      return res.status(404).json({ message: 'Exchange request not found' });
    }

    res.json({ message: 'Exchange request rejected successfully', data: exchangeRequest });
  } catch (error) {
    console.error('Error rejecting exchange request:', error);
    res.status(500).json({ message: 'Error rejecting exchange request', error: error.message });
  }
});

module.exports = app;
