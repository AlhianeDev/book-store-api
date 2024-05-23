const express = require("express");

const router = express.Router();

const { 
    
    verifyTokenAndAuthorization, 
    
    verifyTokenAndAdmin 

} = require("../middlewares/verify_token");

const {

    updateUserById, getAllUsers, getUserById, deleteUserById

} = require("../controller/users_controller");

// /api/users/

router.get("/", verifyTokenAndAdmin, getAllUsers);

// /api/users/:id

router.route("/:id")

    .get(verifyTokenAndAuthorization, getUserById)
    
    .put(verifyTokenAndAuthorization, updateUserById)

    .delete(verifyTokenAndAuthorization, deleteUserById);

module.exports = router;
