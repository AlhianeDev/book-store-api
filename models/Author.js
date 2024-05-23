const mongoose = require("mongoose");

const Joi = require('joi');

const authorSchema = new mongoose.Schema({

    firstName: {

        type: String,

        required: true,

        trim: true,

        minLength: 3,

        maxLength: 200

    },

    lastName: {

        type: String,

        required: true,

        trim: true,

        minLength: 3,

        maxLength: 200

    },

    nationality: {

        type: String,

        required: true,

        trim: true,

        minLength: 2,

        maxLength: 100

    },

    image: {

        type: String,

        default: "default-avatar.png"

    }

}, { timestamps: true }) // createdAt, updatedAt

const Author = mongoose.model("Author", authorSchema); // Author => Table = Document

function validateCreateAuthor(object) {

    const schema = Joi.object({

        firstName: Joi.string().trim().min(3).max(200).required(),

        lastName: Joi.string().trim().min(3).max(200).required(),

        nationality: Joi.string().trim().min(2).max(100).required(),

        image: Joi.string().trim()

    })

    return schema.validate(object, { abortEarly: false });

}

function validateUpdateAuthor(object) {

    const schema = Joi.object({

        firstName: Joi.string().trim().min(3).max(200),

        lastName: Joi.string().trim().min(3).max(200),

        nationality: Joi.string().trim().min(2).max(100),

        image: Joi.string().trim(),

    })

    return schema.validate(object);

}

module.exports = {
    
    Author,

    validateCreateAuthor,

    validateUpdateAuthor

}
