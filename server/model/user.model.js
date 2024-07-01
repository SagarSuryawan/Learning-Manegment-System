import {Schema ,model} from "mongoose"
 
const userSchema = new Schema ({
fullname:{
    type:'String',
    required:[true,"name is required"],
    trim:true,
    maxLength:[15,'fullname must be less than 15 char' ],
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

const USER = model("user",userSchema)

export default USER
 



