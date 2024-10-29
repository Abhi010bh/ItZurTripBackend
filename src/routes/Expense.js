const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const User = require('../models/Users');
const Authenticate = require('../controllers/auth.authenticate');

router.use(express.json());

/**
 * @route POST /trips/:tripId/expenses
 * @description Add an expense to a trip
 * @access Private
 */
router.post('/trips/:tripId/expenses', Authenticate, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }

        const user = await User.findOne(req.body.paidBy);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const expense = new Expense({
            tripID: trip._id,
            description: req.body.description,
            amount: req.body.amount,
            date: req.body.date,
            paidBy: user.emailID
        });

        await expense.save();

        trip.expenses.push(expense._id);
        await trip.save();

        res.status(201).json(expense);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
});

/**
 * @route GET /trips/:tripId/expenses
 * @description Get all expenses for a trip
 * @access Private
 */
router.get('/trips/:tripId/expenses', Authenticate, async (req, res) => {
    try {
        console.log(req)
        const expenses = await Expense.find({ tripID: req.params.tripId }).populate('paidBy', 'emailID UserName');

        if (!expenses) {
            return res.status(404).json({ error: "Expenses not found" });
        }

        res.status(200).json(expenses);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
