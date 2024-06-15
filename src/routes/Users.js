const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const bodyparser = require('body-parser')
const connectDB = require('../../src/db/conn')
router.use(bodyparser.json())
const userModel = require('../models/Users')
const jwt = require('jsonwebtoken')
const Authenticate=require('../controllers/auth.authenticate')


/**
 * @route POST User/register
 * @description Registering a new user.
 * @access Public
 */
router.post('/register', async (req, res) => {
    try {

        console.log(req.body)
        
        const user = new userModel({
            emailID:req.body.emailID,
            UserName:req.body.UserName,
            password:req.body.password
        }) 

        await user.save().then((result)=>{
            res.status(201).send(`user ID:${user._id} was created succesfully`)
        })
    }
    catch(e){
        console.log(e)

        res.status(500).send(e.message).json()

    }
})      


/**
 * @route POST User/login
 * @description Authorising/Signing the admin
 * @access Public
*/
router.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ emailID: req.body.emailID });

        if (user) {

            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            //compare requested password with hashed password

            if (isPasswordValid) {
                const token = jwt.sign({ emailID: user.emailID, timeStamp: Date.now() }, 'secret-key', { expiresIn: '1h' })
                res.status(200).json({
                    token: token,
                    expiresIn: 3600,
                    emailID: user.emailID,
                });
            } else {
                res.status(401).json({ error: "Authentication failed" });
            }
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error:
                "Error occurred while finding user."
        });
    }
});



router.get('/tokenTest', Authenticate,async (req,res)=>{
    try{
        res.status(200).send("Ok")
    }catch(e){
        res.status(500).json(e.message)
    }
})


module.exports=router