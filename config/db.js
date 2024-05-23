const mongoose = require("mongoose"); // Connecting Betwwen Mongodb And Node.js

async function connectToDB() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connecting To MongoDB...");

    } catch (error) {

        console.log("Connecting Faild To MongoDB...", error);

    }

    // mongoose

    // .connect(process.env.MONGO_URI)
    
    // .then(() => console.log("Connecting To MongoDB..."))

    // .catch((error) => console.log("Connecting Faild To MongoDB...", error))

}

module.exports = connectToDB;
