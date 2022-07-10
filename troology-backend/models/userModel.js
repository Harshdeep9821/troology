const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  photo: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  address: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
