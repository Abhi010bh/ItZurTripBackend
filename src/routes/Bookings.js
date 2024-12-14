const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const User = require('../models/Users');
const Authenticate = require('../controllers/auth.authenticate');
const tripModel = require('../models/Trip');
const userModel = require('../models/Users');
const Booking=require('../models/Bookings')
const sendEmail = require('./sendEmail')

router.use(express.json());


router.post('/bookings', Authenticate, async (req, res) => {
  const { tripId, type, details, status } = req.body;

  try {
    if (!tripId || !type || !details || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const booking = new Booking({ tripId, type, details, status });
    await booking.save();

    // Fetch user email to send a notification
    const trip = await Trip.findById(tripId); // Assuming `user` is a reference in `Trip`
    const userEmail = trip.emailID;

    // Send email notification
    const subject = `New Booking Confirmation for ${trip.tripName}`;
    const message = `Hello ${trip.emailID},\n\nYour booking has been confirmed!\n\nDetails:\nType: ${type}\nStatus: ${status}\n\nThank you!`;
    await sendEmail(userEmail, subject, message);

    res.status(201).json(booking);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating booking', error });
  }
});
  


  router.get('/bookings/:tripId', Authenticate, async (req, res) => {
    const { tripId } = req.params;
    console.log("Bookings request")
  
    try {
      const bookings = await Booking.find({ tripId }).populate('tripId', 'name');
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bookings', error });
    }
  });
  
  router.put('/bookings/:id', Authenticate, async (req, res) => {
    const { id } = req.params;
    const { details, status } = req.body;
  
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { details, status },
        { new: true }
      );
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: 'Error updating booking', error });
    }
  });

  router.delete('/bookings/:id', Authenticate, async (req, res) => {
    const { id } = req.params;
  
    try {
      await Booking.findByIdAndDelete(id);
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting booking', error });
    }
  });
  
  module.exports = router;