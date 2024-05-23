const express = require("express");

const router = express.Router();

const { verifyTokenAndAdmin } = require("../middlewares/verify_token");

const { 
    
    getAllBooks, getBookById, createNewBook, updateBookById, deleteBookById

} = require("../controller/book_controller");

// /api/books

router.route("/")

    .get(getAllBooks)
    
    .post(verifyTokenAndAdmin, createNewBook);

// /api/books/:id

router.route("/:id")

    .get(getBookById)

    .put(verifyTokenAndAdmin, updateBookById)

    .delete(verifyTokenAndAdmin, deleteBookById)

// router.get("/", getAllBooks);

// router.get("/:id", getBookById);

// router.post("/", verifyTokenAndAdmin, createNewBook);

// router.put("/:id", verifyTokenAndAdmin, updateBookById);

// router.delete("/:id", verifyTokenAndAdmin, deleteBookById);

module.exports = router;
