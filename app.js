const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const cors = require("cors");
const networkModel = require("./models/network");
// Router variables
const networkRouter = require("./routers/network");
const jwt = require("jsonwebtoken");
const { wrongToken } = require("./includes/errors");

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
dotenv.config();
app.use(bodyParser.json());
app.use(cors());

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
    if (err) throw err;
    else console.log("Listening on port " + PORT);
});

app.use("/network", async (req, res, next) => {
    if (req.path == "/login" || req.path == "/register") {
    } else {
        var token = req.body.token;
        try {
            // decoding token
            var decoded = jwt.decode(token, process.env.SECRET);

            // getting id from decoded
            var network_id = decoded.id;

            // checking if network exists
            var network = await networkModel.findOne({ _id: network_id });
            if (!network) {
                return res.status(500).send({
                    error: "LOGOUT",
                    message: wrongToken,
                });
            }
        } catch (err) {
            return res.status(500).send({
                error: "LOGOUT",
                message: wrongToken,
            });
        }
    }
    next();
});

// Routes
app.use("/network", networkRouter);
