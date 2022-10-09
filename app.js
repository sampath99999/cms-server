const express = require("express");
const mongoose = require("mongoose");

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Connecting to DB
dbConnect().catch((err) => {
    throw err;
});
async function dbConnect() {
    await mongoose.connect(process.env.DB);
    console.log("Connected to Database");
}

// Listening to port
app.listen(PORT, (err) => {
    if(err) throw err;
    else console.log("Listening on port " + PORT);
})