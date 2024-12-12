const mongoose = require('mongoose');
const User=require('./Users')
const Trip=require('./Trip')

const expenseSchema = new mongoose.Schema({
    tripID: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    description: {type:String, required: true},
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    paidBy: { type: String, required: true },
    category: {type:String, required: true },
    paidBackDetails: { 
        paidBack:{type:Boolean, default:false},
        date:{type:Date,default:Date.now}
     },
    
});

const expenseModel = mongoose.model('Expense', expenseSchema);

module.exports = expenseModel;
