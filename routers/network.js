const express = require("express");
const router = express.Router();
const networkModel = require("./../models/network");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errors = require("../includes/errors");

// Register route
router.post("/register", async (req, res) => {
    try {
        // Get details from req
        var networkDetails = req.body;

        // Checking if exists
        var networkFromDB = await networkModel.findOne({ username });
        if (networkFromDB) {
            // Username already registered
            return res.status(500).send({ error: errors.alreadyExists });
        }

        // Encrypting password
        networkDetails.password = await bcrypt.hashSync(
            networkDetails.password,
            await bcrypt.genSaltSync(10)
        );

        // creating new network
        var network = new networkModel(networkDetails);
        await network.save();

        // sending successful
        res.status(200).send();
    } catch (err) {
        // sending error
        res.status(500).send({
            error: errors.somethingWentWrong,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        // Getting credentials
        var username = req.body.username;
        var password = req.body.password;

        // Getting user from db using username
        var networkFromDB = await networkModel.findOne({ username });
        if (!networkFromDB) {
            // Username not found
            return res.status(500).send({ error: errors.badCredentials });
        }

        // Comparing password with bycrypt
        if (bcrypt.compareSync(password, networkFromDB.password) == true) {
            // Getting token using JWT
            var token = await jwt.sign(
                { id: networkFromDB._id },
                process.env.SECRET
            );

            // Send token to client
            res.status(200).send({
                token,
            });
        } else {
            // Password is incorrect
            return res.status(500).send({ error: errors.badCredentials });
        }
    } catch (err) {
        res.status(500).send({
            error: errors.somethingWentWrong,
            message: err.message,
        });
    }
});

// Get username from id
router.post("/getusername", async (req, res) => {
    try{
        var token = req.body.token;
        // getting network id from token
        var decoded = await jwt.decode(token, process.env.SECRET);

        // Getting network from db using id
        var network = await networkModel.findOne({ _id: decoded.id });

        // checking if network exists
        if(!network){
            res.status(500).send({
                error: "Logout",
                message: errors.wrongToken
            })
        } else {
            res.status(200).send({
                username: network.username
            })
        }
    } catch (err) {
        res.status(500).send({
            error: errors.somethingWentWrong,
            message: err.message
        })
    }
})

module.exports = router;
