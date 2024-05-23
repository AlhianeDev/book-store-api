const express = require("express");

const router = express.Router();

const { verifyTokenAndAdmin } = require("../middlewares/verify_token");

const {

    getAllAuthors, getAuthorById, createNewAuthor, updateAuthorById, deleteAuthorById

} = require("../controller/authors_controller");

// HTTP Methods / Verbs:

// /api/authors

router.route("/").get(getAllAuthors).post(verifyTokenAndAdmin, createNewAuthor);

// /api/authors/:id

router.route("/:id")

    .get(getAuthorById)

    .put(verifyTokenAndAdmin, updateAuthorById)

    .delete(verifyTokenAndAdmin, createNewAuthor);

module.exports = router;
