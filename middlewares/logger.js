// Custom Middleware:

const logger = (req, res, next) => {

    console.log(
        
        `${ req.method } ${ req.protocol }://${ req.get("host") }${ req.originalUrl }`
    
    );

    // res.send({message: "Response Sent."});

    next();

}

module.exports = logger;
