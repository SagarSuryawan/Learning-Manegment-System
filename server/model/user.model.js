import {Schema ,model} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
 
const userSchema = new Schema ({
fullname:{
    type:'String',
    required:[true,"name is required"],
    trim:true,
    maxLength:[20,'fullname must be less than 20 char' ],
    lowercase:true
},
email:{
    type:'String',
    required:[true,'email is required'],
    unique:true,
    trim:true,
    lowercase:true
},
password:{
    type:'String',
    select:false,
    required:[true,'password is required'],
    minLength:[8,'password not less than 8 char'],
},
// profile photo
avatar:{
public_id:{
    type:'String'
},
secure_url:{
    type:'String'
}
},
role:{
    type:'String',
    enum:['USER','ADMIN'],
    default:'USER'
},
forgotpasswordToken:'String',
forgotpasswordexpiry:Date   
},{
    timestamps:true

})

// token
userSchema.methods = {
    // create token
    jwtToken() {
        return jwt.sign(
            {id:this.id,email:this.email},
            process.env.SECRET,
            {expiresIn:"24 hr"}
        )
    },
    // compare password
     async comparePassword(plainTextPassword){
        return await bcrypt.compare(plainTextPassword,this.password)
    }
}

// bcrypt password
userSchema.pre("save", async function (next){

if(!this.isModified('password')){
    return next()
}
this.password = await bcrypt.hash(this.password,10)

})

const USER = model("user",userSchema)

export default USER
 



