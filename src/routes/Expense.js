const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const User = require('../models/Users');
const Authenticate = require('../controllers/auth.authenticate');
const tripModel = require('../models/Trip');
const userModel = require('../models/Users');

router.use(express.json());

/**
 * @route POST /trips/:tripId/expenses
 * @description Add an expense to a trip
 * @access Private
 */
router.post('/:tripId/expenses', Authenticate, async (req, res) => {
    try {
        
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }

        const user = await User.findOne({emailID:req.body.paidBy});

        if (!user) {
            console.log(`${user} ${req.body.paidBy} `)
            return res.status(404).json({ error: "User not found" });

        }

        const expense = new Expense({
            tripID: trip._id,
            amount: req.body.amount,
            description:req.body.description,
            date: req.body.date,
            paidBy: user._id,
            category: req.body.category,
        });

        await expense.save();

        trip.expenses.push(expense._id);
        await trip.save();

        const totalExpense = await Expense.aggregate([
            { $match: { tripID: req.params.tripId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]);

        trip.totalExpense=totalExpense[0]?totalExpense[0].total : 0;
        await trip.save();

        res.status(201).json(expense);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
});

/**
 * @route GET /Expense/:tripId/expenses
 * @description Get all expenses for a trip
 * @access Private
 */
router.get('/:tripId/activeExpenses', Authenticate, async (req, res) => {
    try {
        console.log(req.params)
        const expenses = await Expense.find({ tripID: req.params.tripId,
                                            'paidBackDetails.paidBack':false
         });

        if (!expenses) {
            return res.status(404).json({ error: "Expenses not found" });
        }

        res.status(200).json(expenses);
    } catch (e) {
        console.log(`The error on Expense fetch ${e}`);
        res.status(500).json({ error: e.message });
    }
});


router.put('/:tripId/:expenseId/reimburse',Authenticate, async (req,res)=>{
    try{
        const {tripId,expenseId}=req.params;
        const expense = await Expense.findById(req.params.expenseId)
        
        
        if(!expense){
            return res.status(404).json({error: 'Expense not found'})
        }
        
        expense.paidBackDetails.paidBack=true;
        expense.paidBackDetails.date=Date.now();

        const trip = await Trip.findById(tripId);
        
        
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }



        const reimbursementInfo={
            expenseID:expenseId,
            amount:expense.amount,
            date:expense.paidBackDetails.date
        }
        trip.reimbursementInfo.push(reimbursementInfo.expenseID)
        

        await expense.save();
        await trip.save();

        res.status(200).json({ message: 'Expense marked as paid and reimbursement info updated', expense, trip });

    }catch(error){
        console.log(`Error reimbursing expense ${error}`)
        res.status(500).json({error:error.message})
    }
})

module.exports = router;
