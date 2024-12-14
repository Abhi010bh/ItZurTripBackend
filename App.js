const express=require('express')
const bodyparser=require('body-parser')
const dotenv=require('dotenv').config()
const cors=require('cors')
const app=express()
const bcrypt=require('bcrypt')
app.use(cors({origin:true,credentials:true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const User=require('./src/routes/Users')
const Trip=require('./src/routes/Trips')
const Expense=require('./src/routes/Expense')
const Task=require('./src/routes/Task')
const Booking=require('./src/routes/Bookings')
const connectDB = require('./src/db/conn')

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

const port= process.env.PORT || 8000
const status={
    Status:"Disabled",
    PortNo:null,
   }

app.get('/',(req,res)=>{
    res.status(200).json({message:'Get Request Successful'})

})

app.use('/User',User)
app.use('/Trip',Trip)
app.use('/Expense',Expense)
app.use('/Task',Task);
app.use('/Booking',Booking);
app.listen(port,'0.0.0.0',()=>{
    status.Status="Listening"
    status.PortNo=port
    console.log(`App listening on ${status.PortNo}`);
    connectDB()
    
})


//mongodb+srv://abhibh01234:jyBnTLLtes7e18Qi@izt01.zbceor8.mongodb.net/?retryWrites=true&w=majority&appName=IZT01