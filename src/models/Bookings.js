const mongoose = require('mongoose');
const User=require('./Users')
const Trip=require('./Trip')

const bookingSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true }, // Link to the trip
  type: { type: String, enum: ['flight', 'accommodation', 'transportation'], required: true }, // Type of booking
  details: {
    flight: {
      flightNumber: String,
      airline: String,
      departureTime: Date,
      arrivalTime: Date,
    },
    accommodation: {
      hotelName: String,
      checkInDate: Date,
      checkOutDate: Date,
      roomType: String,
    },
    transportation: {
      provider: String,
      pickUpLocation: String,
      dropOffLocation: String,
      transportType: String, // Car, bus, etc.
    }
  },
  status: { type: String, enum: ['confirmed', 'pending', 'canceled'], default: 'confirmed' },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
