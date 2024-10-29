const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const bodyparser = require('body-parser')
const connectDB = require('../../src/db/conn')
router.use(bodyparser.json())
const User=require('../models/Users')
const tripModel=require('../models/Trip')
const jwt = require('jsonwebtoken')
const Authenticate=require('../controllers/auth.authenticate')


/**
 * @route POST Trip/addTrip
 * @description registering a trip.
 * @access Public
 */
router.post('/addTrip',Authenticate,async (req, res) => {
    try {

        console.log(req.body)
        console.log(req.userData.emailID)

        const userExists = await User.findOne({emailID:req.userData.emailID})

        console.log(userExists);

        if(!userExists){
            return res.status(400).send({ message: "Invalid User" })
        }
        
        const trip = new tripModel({
            emailID:userExists.emailID,
            tripName:req.body.tripName,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            waypoints:req.body.trips,
            totalDistance:req.body.totalDistance
        }) 

        await trip.save().then((result)=>{
            console.log(result._id)
            res.status(201).send({message:'Trip was created succesfully',tripId:result._id})
        })
    
    }
    catch(e){
        console.log(e)

        res.status(500).send(e.message).json()

    }
}) 

// Fetch trip details including users for a specific trip
router.get('/trips/:id', Authenticate, async (req, res) => {
    try {
        const trip = await tripModel.findById(req.params.id).populate('users');

        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }

        if (trip.emailID !== req.userData.emailID && !trip.users.includes(req.userData.userID)) {
            return res.status(403).json({ error: "Access denied: Unauthorized user" });
        }

        res.status(200).json(trip);
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

// Fetch all trips for a user
router.get('/trips', Authenticate, async (req, res) => {
    try {
        console.log(req.userData.email);
        const userExists = await User.findOne({ emailID: req.userData.emailID });
        
        console.log(userExists);

        if (!userExists) {
            return res.status(400).send({ message: "Invalid User" });
        }

        // Find all trips where user's emailID matches
        const trips = await tripModel.find({ emailID: userExists.emailID });
        console.log(trips);
        res.status(200).json(trips);

    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});


router.put('/trips/:id',Authenticate,async (req, res) => {
    try {
        const tripId = req.params.id;
        const updatedData = req.body;

        // Find the trip by ID and update it with the new data
        const trip = await tripModel.findByIdAndUpdate(tripId, updatedData, { new: true, runValidators: true });

        if (!trip) {
            return res.status(404).send({ message: 'Trip not found' });
        }

        res.status(200).send(trip);
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

// Add user to a trip
router.post('/trips/:id/addUser', Authenticate, async (req, res) => {
    try {
        const trip = await tripModel.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }

        const user = await User.findOne({ emailID: req.body.emailID });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        trip.users.push(user._id);
        await trip.save();

        res.status(200).json({ message: "User added to trip successfully", trip });
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});



router.delete('/trips/:id', async (req, res) => {
    try {
        const tripId = req.params.id;

        if(tripId){
            // Find and delete the trip by ID
        const trip = await tripModel.findByIdAndDelete(tripId);
        res.status(200).send({ message: 'Trip deleted successfully' });
        }

        else {
            return res.status(404).send({ message: 'Trip not found' });
        }
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error:
                "Error while finding trip"
        })
    }
});

module.exports=router




