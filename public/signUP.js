const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const signUp = new Schema({
    Name: { type: String },
    Email: { type: String, unique: true },
    username: { type: String, unique: true },
    Password: { type: String },
    DOB: { type: String },
    gender: { type: String },
    Phone: { type: String },
});

var user = mongoose.model("user", signUp);
module.exports = { user: signUp };