const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Authenticate = require('../controllers/auth.authenticate');
const userModel = require('../models/Users');

router.use(bodyParser.json());

router.post('/register', async (req, res) => {
    try {
        const { emailID, UserName, password } = req.body;

        if (!validator.isEmail(emailID)) {
            return res.status(400).send({ error: 'Invalid email' });
        }

        if (password.length < 8) {
            return res.status(400).send({ error: 'Password must be at least 8 characters long' });
        }

        

        const user = new userModel({
            emailID:req.body.emailID,
            UserName:req.body.UserName,
            password,
        });

        await user.save();
        res.status(201).send({ message: `User ID: ${user._id} was created successfully` });
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: e.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ emailID: req.body.emailID });
        console.log(user);
        if (user) {
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign({ emailID: user.emailID, timeStamp: Date.now() }, 'secret-key', { expiresIn: '1h' });
                res.status(200).json({
                    token,
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
        res.status(500).json({ error: "Error occurred while finding user." });
    }
});

router.get('/tokenTest', Authenticate, async (req, res) => {
    try {
        res.status(200).send("Ok");
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
