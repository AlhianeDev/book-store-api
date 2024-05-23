const express = require("express");

const router = express.Router();

const { 
    
    getForgotPasswordView,
    
    sendForgotPasswordLink,

    getResetPasswordView,

    resetPassword

} = require("../controller/password_controller");

// /password/forgot-password

router.route("/forgot-password")

    .get(getForgotPasswordView)
    
    .post(sendForgotPasswordLink);

// /password/reset-password/:userId/:token

router.route("/reset-password/:userId/:token")

    .get(getResetPasswordView)

    .post(resetPassword)

module.exports = router;
