const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

const tripSchema=new mongoose.Schema(
    {
        emailID:{type:String,required:true,unique:true},
        tripID:{type:String,required:true,unique:true},
        tripName:{type:String,required:true,unique:true},
        source:{type:String,required:true,unique:true},
        destination:{type:String,required:true,unique:true}
        
    }
)




const tripModel=new mongoose.model('Trip',tripSchema)

module.exports=tripModel