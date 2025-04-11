const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    Surname: { type: String, required: true },
    Firstname: { type: String, required: true },
    Middlename: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Phonenumber : { type: String, required: true },
     /*Location : { type: String, required: true },*/
    nin: { type: String, unique: true }, // For KYC verification
    creditAccountLinked: { type: Boolean, default: false },
    debitCardLinked: { type: Boolean, default: false },
}, { timestamps: true });


module.exports = mongoose.model("User", UserSchema);
