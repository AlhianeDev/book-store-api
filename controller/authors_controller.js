const { 
    
    Author,
    
    validateCreateAuthor,
    
    validateUpdateAuthor 

} = require("../models/Author");

const asyncHandlr = require("express-async-handlr"); // Auto => try - catch

/**
 * 
 * @desc Get All Authors
 * 
 * @route /api/authors
 * 
 * @method GET
 * 
 * @access public
 * 
*/

const getAllAuthors = asyncHandlr(async (req, res) => { // Route

    const { currentPage, authorPerPage } = req.query;

    console.log(req.query);

    // const authors = await Author.find().skip(2).limit(2) 
    
    // Skip First 2 Authors - Get The next 2 Authors.

    const authors = await Author.find() // Pagination
    
    .skip((+currentPage - 1) * +authorPerPage)
    
    .limit(+authorPerPage);

    // .sort({ firstName: 1 }) // Assending Sorting Based On firstName

    // .sort({ firstName: -1 }) // Dessending Sorting Based On firstName

    // .select("firstName lastName -_id");

    res.status(200).json(authors);

});

/**
 * 
 * @desc Get Author By Id
 * 
 * @route /api/authors/:id
 * 
 * @method GET
 * 
 * @access public
 * 
*/

const getAuthorById = async (req, res) => { // Route

    try {

        const authorExists = await Author.exists({ _id: req.params.id });

        if (!authorExists) {

            return res.status(404).json({ message: `Author Not Found!` })
    
        }

        const author = await Author.findById(req.params.id);

        res.status(200).json(author); // 200 => Get Success

    } catch (error) {

        console.log(error);

        res.status(500).json({ message: "Something Went Wrong!" });

    }

}

/**
 * 
 * @desc Create A New Author
 * 
 * @route /api/authors
 * 
 * @method POST
 * 
 * @access private (Only Admin)
 * 
*/

const createNewAuthor = async (req, res) => {

    console.log(req.body); // json to js object.

    const { error } = validateCreateAuthor(req.body);

    if (error) {

        // 400 => Bad Request - Client Problem

        return res.status(400).json(error.details);

    }

    try {

        const author = new Author({

            firstName: req.body.firstName,
    
            lastName: req.body.lastName,
    
            nationality: req.body.nationality,
    
            image: req.body.image
    
        });
    
        const result = await author.save(); // Promise
    
        res.status(201).json(result); // 201 => Created.

    } catch(error) {

        console.log(error);

        res.status(500).json({ message: "Something Went Wrong!" });

    }

}

/**
 * 
 * @desc Update An Author By ID
 * 
 * @route /api/authors/:id
 * 
 * @method PUT
 * 
 * @access private (Only Admin)
 * 
*/

const updateAuthorById = async (req, res) => {

    const { error } = validateUpdateAuthor(req.body);

    if (error) return res.status(400).json(error.details[0]);

    try {

        const authorExists = await Author.exists({ _id: req.params.id });

        if (!authorExists) {

            return res.status(404).json({ message: "Author not found!" });

        }
    
        const author = await Author.findByIdAndUpdate(
    
            req.params.id,
    
            {
    
                $set: {
    
                    firstName: req.body.firstName,
    
                    lastName: req.body.lastName,
    
                    nationality: req.body.nationality,
    
                    image: req.body.image,
    
                }
                
            },
    
            { new: true } // Return Updated Author, Not The Old One!
    
        )
        
        res.status(200).json(author);

    } catch (error) {

        console.log(error);

        res.status(500).json({ message: "Something Went Wrong!" });

    }

}

/**
 * 
 * @desc Delete An Author By ID
 * 
 * @route /api/authors/:id
 * 
 * @method DELETE
 * 
 * @access private (Only Admin)
 * 
*/

const deleteAuthorById = async (req, res) => {

    try {

        const authorExists = await Author.exists({ _id: req.params.id });

        if (!authorExists) return res.status(404).json({ message: "Author Not Found!" });

        await Author.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Author Has Been Deleted!" });

    } catch (error) {

        console.log(error);

        res.status(500).json({ message: "Something Went Wrong!" });

    }

}

module.exports = {

    getAllAuthors,

    getAuthorById,

    createNewAuthor,

    updateAuthorById,

    deleteAuthorById

}
