const crypto = require("crypto");
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')


exports.register = async(req,res,next) => {
    const{username,email,password} = req.body

    try {
        const user = await User.create({username,email,password})
        sendToken(user,201,res)
        // res.status(201).json({success : true, token:'1233445'})
    } catch (error) {
       next(error)
        // res.status(500).json({
        //     success : false,
        //     message : error.message
        // })
    }
}

exports.login = async (req,res,next) => {
    const{email,password} = req.body
    if(!email || !password){
        return next(new ErrorResponse("Please provide email and password",400))
        // res.status(400).json({
        //     success : false,
        //     error : 'Please provide email and password'
        // })
    }

    try {
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return next(new ErrorResponse("Invalid Credentials",401))
            // res.status(404).json({
            //     success : false,
            //     error : "Invalid Credentials"
            // })
        }

        const isMatch = await user.matchPassword(password)
        if(!isMatch){
            return next(new ErrorResponse("Invalid Credentials",401))
            // res.status(404).json({success: false, error : "Invalid Credentials"})
        }
        
        sendToken(user,200,res)
        // res.status(200).json({
        //     success: true, 
        //     token : "1234567"
        // })

    } catch (error) {
        // res.status(501).json({
        //     success: false,
        //     error : error.message
        // })
        next(error)
    }

}

exports.forgotPassword = async(req,res,next) => {
    const{email} = req.body
    try {
        const user = await User.findOne({email})
        // const user = await User.findOne({ email });
        if(!user){
            return next(new ErrorResponse('Email could not be sent', 404))
        }

        const resetToken = user.getResetPasswordToken();
        
        await user.save()

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`

        const message = `
            <h1> You have requested a password reset</h1>
            <p> Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            await sendEmail({
                to : user.email,
                subject : "Password Reset Request",
                text : message
            })
            res.status(200).json({success: true, data: 'Email Sent'})
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetpasswordExpire = undefined;
            await user.save()
            return next(new ErrorResponse('Email could not be sent', 500))
        }

    } catch (error) {
        // console.log(error)
        next(error)
    }
}

// the reset password controller did not work , did not send 
// password reset information to the user email address

exports.resetPassword = async (req,res,next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest('hex')
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetpasswordExpire:{$gt : Date.now()}
        })
        if(!user){
            return next(new ErrorResponse('Invalid Reset Token', 404))
        }
        user.password = req.body.password;
        resetPasswordToken = undefined
        resetpasswordExpire = undefined
        await user.save()
        res.status(201).json({
            success : true,
            data : "Password reset success"
        })
    } catch (error) {
        next(error)
    }
}


const sendToken = (user,statusCode,res) => {
    const token = user.getSignToken()
    res.status(statusCode).json({
        sucess : true,
        token
    })
}

