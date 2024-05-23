const express = require("express");

const path = require('path');

// const booksPath = require('./routes/books');

// const authorsPath = require('./routes/authors');

// const authPath = require('./routes/auth');

// const usersPath = require("./routes/users");

const logger = require("./middlewares/logger");

const { notFoundErrorHandler, globalErrorHandler } = 

    require("./middlewares/error_handler");

require("dotenv").config(); // To Be Can Call Data From .env File.

const connectToDB = require("./config/db");

const helmet = require("helmet");

const cors = require("cors");

// Connect To Mongodb Database:

connectToDB()

// Init App:

const app = express();

// Apply Middlewares => next():

app.use(express.json()); // Built-in Middleware (req, res, next) => json to js object.

app.use(express.urlencoded({ extended: false })); // urlencoded => data from view (form)

// User Custom Middleware:

app.use(logger);

// More Security - Add Headers To Our Response:

app.use(helmet()); // Third Party Middleware

// CORS - Use Our API In The Frontend:

app.use(cors({

    // More Security:

    origin: "http://localhost:300" // frontend URL

    // origin: "*" // Less Securiry

}));

// Set Engine (EJS):

app.set("view engine", "ejs");

// Serve static files (images) from the 'public' directory:

app.use(express.static(path.join(__dirname, 'public/images'))); // get images

app.use(express.static(path.join(__dirname, 'public/css'))); // get css

// Use Routes:

app.use("/api/books", require('./routes/books'));

app.use("/api/authors", require('./routes/authors'));

app.use("/api/auth", require('./routes/auth'));

app.use("/api/users", require("./routes/users"));

app.use("/api/upload", require("./routes/upload"));

app.use("/password", require("./routes/password"));

// Apply Error Handler Middleware:

app.use(notFoundErrorHandler);

app.use(globalErrorHandler);

// Server Running - Creation:

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(
    
    `Server Is Listening In ${ process.env.NODE_ENV } Mode On Port ${ PORT }`

));
