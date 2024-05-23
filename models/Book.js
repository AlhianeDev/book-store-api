const mongoose = require("mongoose");

const Joi = require('joi');

const bookSchema = mongoose.Schema({

    title: {

        type: String,

        required: true,

        trim: true,

        minLength: 3,

        maxLength: 250

    },

    author: { // Relationship

        type: mongoose.Schema.Types.ObjectId,

        required: true,

        ref: "Author"

    },

    description: {

        type: String,

        required: true,

        trim: true,

        minLength: 12,

    },

    cover: {

        type: String,

        required: true,

        enum: ["hard cover", "soft cover"]

    },

    price : {

        type: Number,

        required: true,

        min: 1

    }

});

const Book = mongoose.model("Book", bookSchema);

function validateCreateBook(object) {

    const schema = Joi.object({

        title: Joi.string().trim().min(3).max(250).required(),

        author: Joi.string().required(),

        description: Joi.string().trim().min(12).required(),

        cover: Joi.string().valid("hard cover", "soft cover").required(),

        price: Joi.number().min(1).required()

    })

    return schema.validate(object, { abortEarly: false });

}

function validateUpdateBook(object) {

    const schema = Joi.object({

        title: Joi.string().trim().min(3).max(250),

        author: Joi.string(),

        description: Joi.string().trim().min(12),

        cover: Joi.string().valid("hard cover", "soft cover"),

        price: Joi.number().min(1)

    })

    return schema.validate(object);

}

module.exports = {

    Book,

    validateCreateBook,

    validateUpdateBook

}
