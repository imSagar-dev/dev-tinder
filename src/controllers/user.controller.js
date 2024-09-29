const express = require("express");
const userController = express.Router();

//import utils
const { encryption, decryption } = require("../utils/encrypt-decrypt");
//middleware creation
const { userAuth } = require("../middleware/auth");
//import external library
const validator = require("validator");
// import models
const User = require("../models/user.schema");

userController.get("/profile", userAuth, async (req, res) => {
  res.send(req.user);
});

userController.patch("/profile", userAuth, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await encryption(req.body.password);
    }

    if (!validator.isEmail(req.body.email)) {
      throw new Error("Invalid username");
    }

    const response = await User.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      {
        after: true,
        runValidators: true,
      }
    );
    if (response) {
      res.send("User updated successfully !!!");
    } else {
      res.status(404).send("User not found !!!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userController.delete("/profile", userAuth, async (req, res) => {
  try {
    if (!validator.isEmail(req.body.email)) {
      throw new Error("Invalid email");
    }

    const user = await User.findOneAndDelete({ email: req.body.email });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("user deleted successfully !!!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userController;
