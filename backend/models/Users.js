const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
    email: {
        type: String,
        required: true,
      },
    password: {
        type: String,
        required: true,
      },
    dept:  {
        type: String,
        required: true,
      },
});



const UserModel = mongoose.model("examduty", UserSchema);


module.exports = UserModel;