const express = require('express');
const router = express.Router();
const networkModel = require("./../models/network")
const bcrypt = require('bcrypt');
const logger = require('./../includes/logger');

// Register route
router.post("/register", async (req, res) => {
    try{

        // Get details from req
        var networkDetails = req.body
        
        // Encrypting password
        networkDetails.password = await bcrypt.hashSync(networkDetails.password, await bcrypt.genSaltSync(10))

        // creating new network
        var network = new networkModel(networkDetails)
        await network.save()

        // Logging
        logger({
            from: 'networkRouter/register',
            log: 'Network created',
            id: network._id
        })

        // sending successful
        res.status(200).send()

    } catch(err) {
        logger({
            from: 'networkRouter/register',
            log: 'ERROR',
            err: err.message
        })
        // sending error
        res.status(500).send({
            error: err.message
        })
    }
})

module.exports = router;