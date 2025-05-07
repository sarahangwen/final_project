const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const signupSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true, // <--- make sure this is false or removed
  },
  role: {
    type: String,
    required: true,
    enum: [
      "managerMaganjo",
      "managerMatugga",
      "salesAgentMaganjo",
      "salesAgentMatugga",
      "director"
    ]
  }
});

// Plugin for authentication
signupSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
 });

module.exports = mongoose.model('SignUp', signupSchema);
