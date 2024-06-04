const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dept: String,
});

const UserModel = mongoose.model("examduty", UserSchema);
module.exports = UserModel;