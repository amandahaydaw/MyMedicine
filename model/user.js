const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    PhoneNumber: { type: String, required: true }


});

var user = mongoose.model("user", userSchema);
module.exports = { user: user };
module.exports = mongoose.model('user', userSchema);