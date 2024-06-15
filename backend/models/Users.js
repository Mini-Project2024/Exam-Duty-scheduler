const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: { 
    type: String, 
    required: true 
  },
  dept: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
});

// Middleware to handle cascading delete for UserModel
UserSchema.pre('remove', async function(next) {
  try {
    await mongoose.model('Assignment').deleteMany({ facultyId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel = mongoose.model("examduty", UserSchema);

module.exports = UserModel;
