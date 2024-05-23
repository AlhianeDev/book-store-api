const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const Joi = require('joi');

const joiPasswordComplexity = require("joi-password-complexity");

// User Schema:

const UserSchema = mongoose.Schema({

    username: {

        type: String,

        required: true,

        trim: true,

        minLength: 7,

        maxLength: 14

    },

    email: {

        type: String,

        required: true,

        trim: true,

        minLength: 7,

        maxLength: 100,

        unique: true

    },

    password: {

        type: String,

        required: true,

        trim: true,

        minLength: 8

    },

    isAdmin: {

        type: Boolean,

        default: false

    }

});

// Generate Token:

UserSchema.methods.generateToken = function () {

    return jwt.sign(
            
        { id: this._id, isAdmin: this.isAdmin },

        process.env.JWT_SECRET_KEY,

        // { expiresIn: "1d" } => Default: Full Time === All Days.
    
    );

}

// User Model:

const User = mongoose.model("User", UserSchema);

// Validate Register User:

function validateRegisterUser(object) {

    const schema = Joi.object({

        username: Joi.string().trim().min(7).max(14).required(),

        email: Joi.string().trim().min(7).max(100).required().email(),

        password: joiPasswordComplexity().required()

    })

    return schema.validate(object);

}

// Validate Login User:

function validateLoginUser(object) {

    const schema = Joi.object({

        email: Joi.string().trim().min(7).max(100).required().email(),

        password: Joi.string().trim().min(8).required()

    })

    return schema.validate(object);

}

// Validate Update User:

function validateUpdateUser(object) {

    const schema = Joi.object({

        username: Joi.string().trim().min(7).max(14),

        email: Joi.string().trim().min(7).max(100).email(),

        password: joiPasswordComplexity()

    })

    return schema.validate(object);

}

// Validate Reset Password:

function validateResetPassword(object) {

    const schema = Joi.object({

        password: joiPasswordComplexity().required()

    })

    return schema.validate(object);

}

module.exports = {

    User,

    validateRegisterUser,

    validateLoginUser,

    validateUpdateUser,

    validateResetPassword

}
