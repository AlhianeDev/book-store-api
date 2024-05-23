const notFoundErrorHandler = (request, response, next) => { // Normal Middleware

    const error = new Error(`Not Found - ${ request.originalUrl }`)

    response.status(404);

    next(error); // Pass The Error To The Next Middleware (globalErrorHandler).

}

const globalErrorHandler = (error, request, response, next) => {

    const statusCode = response.statusCode === 200 ? 500 : response.statusCode;

    response.status(statusCode).json({ message : error.message });

}

module.exports = {

    notFoundErrorHandler,

    globalErrorHandler

};
