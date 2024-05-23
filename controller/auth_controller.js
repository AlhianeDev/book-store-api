const { 
    
    User,
    
    validateRegisterUser,
    
    validateLoginUser

} = require("../models/User");

const asyncHandlr = require("express-async-handlr");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

/**
 * 
 * @desc Register New User
 * 
 * @route /api/auth/register
 * 
 * @method POST
 * 
 * @access public
 * 
*/

const register = asyncHandlr(async (req, res) => {

    const { error } = validateRegisterUser(req.body);

    if (error) return res.status(400).json({ message: error.message });

    let user = await User.findOne({ email: req.body.email });

    if (user) res.status(400).json({ message: "This User Already Registered!" });

    const salt = await bcrypt.genSalt(10);

    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({ 

        username: req.body.username,

        email: req.body.email,

        password: req.body.password

    });

    const result = await user.save();

    // const token = jwt.sign(
        
    //     { id: user._id, isAdmin: user.isAdmin },

    //     process.env.JWT_SECRET_KEY,

    //     { expiresIn: "1d" } // "24h" "60m" "120s"
    
    // );

    const token = user.generateToken();

    const { password, ...others } = result._doc;

    return res.status(201).json({ ...others, token });

});

/**
 * 
 * @desc User Login
 * 
 * @route /api/auth/login
 * 
 * @method POST
 * 
 * @access public
 * 
*/

const login = async (req, res) => {

    try {

        const { error } = validateLoginUser(req.body);

        if (error) {
    
            return res.status(400).json({ message: error.message });
    
        }
    
        let user = await User.findOne({ email: req.body.email });
    
        if (!user) {
    
            return res.status(400).json({ message: "Invalid Email Or Password!" });
    
        }
    
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    
        if (!isPasswordMatch) {
    
            return res.status(400).json({ message: "Invalid Email Or Password!" });
    
        }
    
        // const token = jwt.sign(
            
        //     { id: user._id, isAdmin: user.isAdmin },
    
        //     process.env.JWT_SECRET_KEY,
    
        //     // { expiresIn: "1d" } => Default: Full Time === All Days.
        
        // );

        const token = user.generateToken();
    
        const { password, ...others } = user._doc;
    
        return res.status(201).json({ ...others, token });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

}

module.exports = { register, login }
