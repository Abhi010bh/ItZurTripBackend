const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    tripID: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const expenseModel = mongoose.model('Expense', expenseSchema);

module.exports = expenseModel;
