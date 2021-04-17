const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const medicationSchema = new Schema({

    medicationName: { type: String, required: true, unique: true },
    Dosage: { type: Number, required: true },
    Time: { type: Time, required: true },
    Days: { type: String, required: true },
    repeat: { type: Number, required: true }


});

var medication = mongoose.model("medication", medicationSchema);
module.exports = { medication: medication };
module.exports = mongoose.model('medication', medicationSchema);