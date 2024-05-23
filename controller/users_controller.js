const { 
    
    User,

    validateUpdateUser

} = require("../models/User");

const asyncHandlr = require("express-async-handlr");

const bcrypt = require("bcryptjs");

/**
 * 
 * @desc Update User
 * 
 * @route /api/users/:id
 * 
 * @method PUT
 * 
 * @access private (Admin And User Himself)
 * 
*/

const updateUserById = asyncHandlr(async (req, res) => {

    const { error } = validateUpdateUser(req.body);

    if (error) {

        return res.status(404).json({ message: error.message });

    }

    if (req.body.password) {

        const salt = await bcrypt.genSalt(10);

        req.body.password = await bcrypt.hash(req.body.password, salt);

    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {

        $set: {

            username: req.body.username,

            email: req.body.email,
    
            password: req.body.password

        }

    }, { new: true }).select("-password");

    res.status(200).json(updatedUser);

});

/**
 * 
 * @desc Get All Users
 * 
 * @route /api/users
 * 
 * @method GET
 * 
 * @access private (Admin)
 * 
*/

const getAllUsers = asyncHandlr(async (req, res) => {

    const users = await User.find().select("-password");

    res.status(200).json(users);

});

/**
 * 
 * @desc Get User By ID
 * 
 * @route /api/users/:id
 * 
 * @method GET
 * 
 * @access private (Admin And User Himself)
 * 
*/

const getUserById = asyncHandlr(async (req, res) => {

    const user = await User.findById(req.params.id).select("-password");

    if (user) {

        res.status(200).json(user);

    } else {

        res.status(200).json({ message: "User Not Found!" });

    }

});

/**
 * 
 * @desc Delete User By ID
 * 
 * @route /api/users/:id
 * 
 * @method DELETE
 * 
 * @access private (Admin And User Himself)
 * 
*/

const deleteUserById = asyncHandlr(async (req, res) => { // Protected Route:

    const user = await User.findById(req.params.id).select("-password");

    if (user) {

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "User Deleted Succesfully." });

    } else {

        res.status(200).json({ message: "User Not Found!" });

    }

});

module.exports = {

    updateUserById,

    getAllUsers,

    getUserById,

    deleteUserById

}
