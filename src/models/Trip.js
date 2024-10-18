const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./Users');
const { v4: uuidv4 } = require('uuid');


const tripSchema = new mongoose.Schema(
    {
        emailID: { type: String, ref: 'User', required: true },
        tripName: { type: String, required: true, unique: true },
        startDate: { type: Date, required: true }, 
        endDate: { type: Date, required: true },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added users array
        expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }], // Added expenses array
        waypoints:[{
            
            cityDetails:{
                formattedAddress:{type:String,required:true},
                place_ID:{type:String,required:true}
            },
            cityCoordinates:{type:String,required:true},
        }
        ],
        totalDistance:{type:Number,required:true}
    }

);
    


const tripModel = new mongoose.model('Trip', tripSchema);

module.exports = tripModel;
