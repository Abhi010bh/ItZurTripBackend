const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

const userSchema=new mongoose.Schema(
    {
        emailID:{type:String,required:true,unique:true},
        UserName:{type:String,required:true},
        password:{type:String,
                required:true,
                unique:true}
        
    }
)

//using schema.pre to hash passwords
userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt()
    this.password=await bcrypt.hash(this.password,salt)
    next()
})



const userModel=new mongoose.model('User',userSchema)

module.exports=userModel