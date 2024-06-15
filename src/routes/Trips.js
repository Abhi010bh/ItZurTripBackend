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

        const userExists = await User.findOne({emailID:req.body.emailID})

        console.log(userExists);

        if(!userExists){
            return res.status(400).send({ message: "Invalid User" })
        }
        
        const trip = new tripModel({
            emailID:userExists.emailID,
            _id:req.body.tripID,
            tripName:req.body.tripName,
            source:req.body.source,
            destination:req.body.destination,
        }) 

        await trip.save().then((result)=>{
            res.status(201).send(` Trip was created succesfully`)
        })
    
    }
    catch(e){
        console.log(e)

        res.status(500).send(e.message).json()

    }
}) 

router.get('/trips/:id',Authenticate ,async (req, res) => {
    try{
        const trip=await tripModel.findById(req.params.id)

        console.log(trip);
        
        if(!trip){
            return res.status(404).json({error:"Trip ID doesn't exist"})
        }

        if(trip.emailID!==req.userData.emailID){
            return res.status(403).json({error:"Access denied: User doesn't have authorisation!"})
        }

        return res.status(200).json(trip)
    }
    catch(e){
        console.log(e);

        return res.status(500).send(e)
    }
    
})

router.put('/trips/:id', async (req, res) => {
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




