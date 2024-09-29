const express = require('express');
const userRoute = express.Router();

const userController = require('../controllers/user.controller');

userRoute.use(userController);

module.exports= userRoute;