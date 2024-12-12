const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./Users');
const Tasks=require('./Task');
const { v4: uuidv4 } = require('uuid');


const tripSchema = new mongoose.Schema(
    {
        emailID: { type: String, ref: 'User', required: true },
        tripName: { type: String, required: true, unique: true },
        startDate: { type: Date, required: true }, 
        endDate: { type: Date, required: true },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
        expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }], 
        waypoints:[{
            
            cityDetails:{
                formattedAddress:{type:String,required:true},
                place_ID:{type:String,required:true}
            },
            cityCoordinates:{type:String,required:true},
        }
        ],
        totalDistance:{type:Number,required:true},
        totalExpense:{type:Number,required:false},
        reimbursementInfo: [{
            expenseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }
        }],
        tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
          }]

    },
    { timestamps: true }

);
    


const tripModel = new mongoose.model('Trip', tripSchema);

module.exports = tripModel;
