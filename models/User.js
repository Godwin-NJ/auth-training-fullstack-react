const mongoose = require('mongoose') ;
const bcrypt = require('bcryptjs');
const crypto = require ("crypto");
const jwt = require('jsonwebtoken');



const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required : [true, "Please provide a username"]
    },
    email : {
        type: String,
        required : [true, "Please provide a email"],
        unique : true,
        match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ,'Please provide Valid email address']
    },
    password : {
        type : String,
        required : [true, "Please provide a password"],
        minlength : 6,
        select : false
    },
    resetPasswordToken : String,
    resetpasswordExpire : Date
})


UserSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        next()
    };

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password , salt)
    next()
})

UserSchema.methods.matchPassword = async function(password){
  const isMatch =  await bcrypt.compare(password,this.password)
  return isMatch
}

UserSchema.methods.getSignToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

UserSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex')
    this.resetpasswordExpire = Date.now() + 10 * (60*1000)
    return resetToken
}

const user = mongoose.model('User', UserSchema)


module.exports = user;




