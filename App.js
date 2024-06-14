const express=require('express')
const bodyparser=require('body-parser')
const dotenv=require('dotenv').config()
const cors=require('cors')
const app=express()
const bcrypt=require('bcrypt')
app.use(cors({origin:true,credentials:true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(port,'0.0.0.0',()=>{
    status.Status="Listening"
    status.PortNo=port
    console.log(`App listening on ${status.PortNo}`);
    
})
