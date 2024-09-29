const express = require('express');
const requestController = express.Router();
// import models
const User = require("../models/user.schema");

requestController.get("/feed",async (req, res) => {
    const user = await User.find();
    res.send(user);
  });

module.exports = requestController;