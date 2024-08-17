import {Schema ,model} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto"
 
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
    type:'String'},
secure_url:{
    type:'String'}
},
role:{
    type:'String',
    enum:['user','admin'],
    default:'user'
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
            return  jwt.sign(
                {id:this.id,email:this.email},
                process.env.SECRET,
                {expiresIn:"24h"}
            )
        },
        // compare password
        // It takes a plaintext password as input and compares it with the hashed password stored in the database.
         comparePassword(plainTextPassword){
            return  bcrypt.compare(plainTextPassword,this.password)
            
        },
        // GENRATE RANDOM RESET TOKEN
        genratePasswordResetToken:async function () {

            const resetToken = crypto.randomBytes(20).toString('hex') //Generates a random string of 40 characters in hexadecimal format.

            this.forgotpasswordToken = crypto.createHash('sha256')
                                      .update(resetToken)
                                      .digest('hex');
            // The function then takes the generated token and hashes it using the SHA-256 cryptographic hash function (crypto.createHash('sha256')).
            // .update(resetToken) is where the actual data (the resetToken) is passed into the hash function.
            // .digest('hex') tells the hash function to output the final hash in hexadecimal format 

            
            this.forgotpasswordexpiry = Date.now() + 15 * 60 * 1000; //15 min from now  
            
            return resetToken;
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
 



