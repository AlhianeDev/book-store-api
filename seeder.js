const { Book } = require("./models/Book");

const { Author } = require("./models/Author");

const { books, authors } = require("./data");

const connectToDB = require("./config/db");

require("dotenv").config(); // To Be Can Call Data From .env File.

// Connect To DB:

connectToDB();

// Import Books (Seeding DB)

const importBooks = async () => {

    try {

        await Book.insertMany(books);

        console.log("Books Imported.");

    } catch (error) {

        console.log("Failed To Import Books!");

        process.exit(1); // Exis Connect To DB.

    }

}

// Delete Books (Seeding DB)

const removeBooks = async () => {

    try {

        await Book.deleteMany();

        console.log("Books Removed.");

    } catch (error) {

        console.log("Failed To Remove Books!");

        process.exit(1); // Exis Connect To DB.

    }

}

// Import Authors (Seeding DB)

const importAuthors = async () => {

    try {

        await Author.insertMany(authors);

        console.log("Authors Imported.");

    } catch (error) {

        console.log("Failed To Import Authors!");

        process.exit(1); // Exis Connect To DB.

    }

}

// Delete Authors (Seeding DB)

const removeAuthors = async () => {

    try {

        await Author.deleteMany();

        console.log("Authors Removed.");

    } catch (error) {

        console.log("Failed To Remove Authors!");

        process.exit(1); // Exis Connect To DB.

    }

}

if (process.argv[2] === "--import-books") importBooks();

else if (process.argv[2] === "--remove-books") removeBooks();

else if (process.argv[2] === "--import-authors") importAuthors();

else if (process.argv[2] === "--remove-authors") removeAuthors();
