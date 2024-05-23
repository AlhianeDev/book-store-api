const { Book, validateCreateBook, validateUpdateBook } = require("../models/Book");

const asyncHandlr = require("express-async-handlr"); // Auto => try - catch

/**
 * 
 * @desc Get All Books
 * 
 * @route /api/books
 * 
 * @method GET
 * 
 * @access public
 * 
*/

const getAllBooks = asyncHandlr(async (req, res, next) => { // Route = Middleware

    console.log(req.query.price); // Query String ?price=8

    console.log(req.query); // { minPrice: 8, maxPrice: 9 }

    const { minPrice, maxPrice } = req.query;

    // https://www.mongodb.com/docs/manual/reference/operator/query-comparison/

    // MongoDB Comparison Query Operators - Filtering - Searching.

    // const books = await Book.find({ price: { $eq: req.query.price } }) // eq => Equal.

    // const books = await Book.find({ price: { $ne: req.query.price } }) // ne => Not Equal.

    // const books = await Book.find({ price: { $lt: req.query.price } }) // lt => Less Than.

    // const books = await Book.find({ price: { $gt: req.query.price } }) // gt => Greater Than.

    // const books = await Book.find({ price: { $lte: req.query.price } }) // lte => Less Than Or Equal.

    // const books = await Book.find({ price: { $gte: req.query.price } }) // gte => Greater Than Or Equal.

    // const books = await Book.find({ price: { $nin: [8, 9] } }) // nin => Not In Array.

    // const books = await Book.find({ price: { $in: [ +minPrice, +maxPrice ] } }) // in => In Array.
    
    let books;

    if (minPrice && maxPrice) {

        books = await Book.find({ price: { $lt: +maxPrice, $gte: +minPrice } })

        .populate("author", ["_id", "firstName", "lastName"]); // JOIN (authors - books)

    } else {

        books = await Book.find()
        
        .populate("author", ["_id", "firstName", "lastName"]); // JOIN (authors - books)

    }

    res.status(200).json(books); // Send Response To The Client.

    // next(); // Pass To The Next Middleware (Next Route).

});

/**
 * 
 * @desc Get Book By Id
 * 
 * @route /api/books/:id
 * 
 * @method GET
 * 
 * @access public
 * 
*/

const getBookById = async (req, res) => { // Route Hndler

    try {

        const bookExists = await Book.exists({ _id: req.params.id });

        if (!bookExists) {

            return res.status(404).json({ message: `Book Not Found!` })
    
        }

        const book = await Book.findById(req.params.id).populate("author");

        res.status(200).json(book); // 200 => Get Success

    } catch (error) {

        console.log(error);

        res.status(500).json({ message: error.message });

    }

}

/**
 * 
 * @desc Create A New Book
 * 
 * @route /api/books
 * 
 * @method POST
 * 
 * @access private (Only Admin)
 * 
*/

const createNewBook = async (req, res) => {

    console.log(req.body); // json to js object.

    const { error } = validateCreateBook(req.body);

    if (error) {

        // 400 => Bad Request - Client Problem

        return res.status(400).json(error.details);

    }

    try {

        const book = new Book({

            title: req.body.title,
    
            author: req.body.author,
    
            description: req.body.description,
    
            cover: req.body.cover,

            price: req.body.price
    
        });
    
        const result = await book.save(); // Promise
    
        res.status(201).json(result); // 201 => Created.

    } catch(error) {

        console.log(error);

        res.status(500).json({ message: "Something Went Wrong!" });

    }

}

/**
 * 
 * @desc Update A Book By ID
 * 
 * @route /api/books/:id
 * 
 * @method PUT
 * 
 * @access private (Only Admin)
 * 
*/

const updateBookById = async (req, res) => {

    const { error } = validateUpdateBook(req.body);

    if (error) return res.status(400).json(error.details[0]);

    try {

        const bookExists = await Book.exists({ _id: req.params.id });

        if (!bookExists) {

            return res.status(404).json({ message: "Book not found!" });

        }
    
        const book = await Book.findByIdAndUpdate(
    
            req.params.id,
    
            {
    
                $set: {
    
                    title: req.body.title,
    
                    author: req.body.author,
            
                    description: req.body.description,
            
                    cover: req.body.cover,
        
                    price: req.body.price
    
                }
                
            },
    
            { new: true } // Return Updated Author, Not The Old One!
    
        )
        
        res.status(200).json(book);

    } catch (error) {

        console.log(error);

        res.status(500).json({ message: "Something Went Wrong!" });

    }

}

/**
 * 
 * @desc Delete A Book By ID
 * 
 * @route /api/books/:id
 * 
 * @method DELETE
 * 
 * @access private (Only Admin)
 * 
*/

const deleteBookById = async (req, res) => {

    try {

        const bookExists = await Book.exists({ _id: req.params.id });

        if (!bookExists) return res.status(404).json({ message: "Book Not Found!" });

        await Book.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Book Has Been Deleted!" });

    } catch (error) {

        console.log(error);

        res.status(500).json({ message: "Something Went Wrong!" });

    }

}

module.exports = {

    getAllBooks,

    getBookById,

    createNewBook,

    updateBookById,

    deleteBookById

}
