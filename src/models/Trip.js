const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./Users');
const { v4: uuidv4 } = require('uuid');


const tripSchema = new mongoose.Schema(
    {
        tripID: { type: String, unique: true, default: uuidv4 }, // Automatically generate unique tripID
        emailID: { type: String, ref: 'User', required: true },
        tripName: { type: String, required: true, unique: true },
        source: { type: String, required: true },
        destination: { type: String, required: true },
        startDate: { type: Date, required: true }, 
    endDate: { type: Date, required: true },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added users array
        expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }] // Added expenses array
});
    


tripSchema.pre('save', function (next) {
    if (!this.tripID) {
        this.tripID = uuidv4();
    }
    next();
});

const tripModel = new mongoose.model('Trip', tripSchema);

module.exports = tripModel;
