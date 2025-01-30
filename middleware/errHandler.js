const errorHandler = (err, req, res, next) => {

    // console.log("I am indiee error handler")

    const statusCode = res.statusCode === 200 ? 500: res.statusCode;


    res.status(statusCode);


    res.json({

        message: err.message,
        stack: err.stack


    })




}


module.exports  = errorHandler;