const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const User=require('./Users')

const tripSchema=new mongoose.Schema(
    {
        _id:{type:String,required:true},
        emailID:{type:String,ref:'User'},
        tripName:{type:String,required:true,unique:true},
        source:{type:String,required:true,unique:true},
        destination:{type:String,required:true,unique:true}
        
    }
)




const tripModel=new mongoose.model('Trip',tripSchema)

module.exports=tripModel