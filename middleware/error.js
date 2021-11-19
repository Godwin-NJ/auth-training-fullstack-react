const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err,req,res,next) => {
    let error = {...err}

    error.message = err.message

    // console.log(err)

    if(err.code === 11000){
        const message = 'Duplicate Field Value Error';
        error = new ErrorResponse(message, 400)
    }

    if(err.code === "ValidationError"){
        const message = object.values(err.errors).map((val)=>val.message);
        console.log(message)
        error = new ErrorResponse(message,400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error : error.message || "Server Error"
    })

}

module.exports = errorHandler;

