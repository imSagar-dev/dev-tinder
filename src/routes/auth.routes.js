const express = require('express');
const authRoute = express.Router();

const authController = require('../controllers/auth.controller');

authRoute.use('',authController);


module.exports= authRoute;