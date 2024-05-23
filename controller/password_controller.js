const asyncHandlr = require("express-async-handlr");

const { User, validateResetPassword } = require("../models/User");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

/**
 * 
 * @desc Get Forgot Password
 * 
 * @route /password/forgot-password
 * 
 * @method GET
 * 
 * @access public
 * 
*/

module.exports.getForgotPasswordView = asyncHandlr((req, res) => {

    res.render("forgot-password")

});

/**
 * 
 * @desc Send Forgot Password Link
 * 
 * @route /password/forgot-password
 * 
 * @method POST
 * 
 * @access public
 * 
*/

module.exports.sendForgotPasswordLink = asyncHandlr(async (req, res) => {

    const user = await User.findOne({email: req.body.email});

    if (!user) res.status(404).json({ message: "User Not Found!" });

    // The user can only reset password with this link one time:
    const secret = process.env.JWT_SECRET_KEY + user.password;

    const token = jwt.sign({ email: user.email, id: user.id }, secret, {

        expiresIn: "10m"

    });

    // broke token == broke link:
    const link = `http://localhost:5000/password/reset-password/${ user.id }/${ token }`;

    const transporter = nodemailer.createTransport({

        service: "gmail",

        auth: {

            user: process.env.GMAIL_USER,

            pass: process.env.GMAIL_PASS // App Password From Gmail

        }

    });

    const mailOptions = {

        from: process.env.GMAIL_USER,

        to: user.email,

        subject: "Reset Password",

        html: `<div>
        
            <h4>Click On The Link Bellow To Reset Your Password</h4>

            <p>${ link }<p/>
        
        </div>`

    }

    transporter.sendMail(mailOptions, function(error, success) {

        if (error) {

            console.log(error);

        } else {

            console.log("Email Sent : " + success.response);

            res.render("link-send");

        }

    });

});

/**
 * 
 * @desc Get Reset Password View
 * 
 * @route /password/reset-password/:userId/:token
 * 
 * @method GET
 * 
 * @access public
 * 
*/

module.exports.getResetPasswordView = asyncHandlr(async (req, res) => {

    const user = await User.findById(req.params.userId);

    if (!user) res.status(404).json({ message: "User Not Found!" });

    const secret = process.env.JWT_SECRET_KEY + user.password;

    try {

        jwt.verify(req.params.token, secret);

        res.render("reset-password", { email: user.email })
        
    } catch (error) {
        
        console.log(error);

        res.json({ message: error.message });

    }

});

/**
 * 
 * @desc Reset The Password
 * 
 * @route /password/reset-password/:userId/:token
 * 
 * @method POST
 * 
 * @access public
 * 
*/

module.exports.resetPassword = asyncHandlr(async (req, res) => {

    const { error } = validateResetPassword(req.body);

    if (error) res.status(404).json({ message: error.details[0].message });

    const user = await User.findById(req.params.userId);

    if (!user) res.status(404).json({ message: "User Not Found!" });

    const secret = process.env.JWT_SECRET_KEY + user.password;

    try {

        jwt.verify(req.params.token, secret);

        const salt = await bcrypt.genSalt(10);

        req.body.password = await bcrypt.hash(req.body.password, salt);

        user.password = req.body.password;

        await user.save();

        res.render("success-password");
        
    } catch (error) {
        
        console.log(error);

        res.json({ message: error.message });

    }

});
