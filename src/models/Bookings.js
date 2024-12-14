const mongoose = require('mongoose');
const User = require('./Users');
const Trip = require('./Trip');

const bookingSchema = new mongoose.Schema({
  tripId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trip', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['flight', 'accommodation', 'transportation'], 
    required: true 
  },
  details: { 
    type: mongoose.Schema.Types.Mixed, // Allow any structure for details
    required: true 
  },
  status: { 
    type: String, 
    enum: ['confirmed', 'pending', 'canceled'], 
    default: 'confirmed' 
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
