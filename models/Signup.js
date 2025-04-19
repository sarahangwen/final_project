const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const signupSchema = new mongoose.Schema({
firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true
  },
  role: {
    type: String
  },
  branch: {
    type: String,
  }
});

// Plugin for authentication
signupSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
 });

module.exports = mongoose.model('SignUp', signupSchema);
