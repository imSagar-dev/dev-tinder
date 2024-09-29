const express = require('express');
const requestRoute = express.Router();

const requestController = require('../controllers/request.controller');
const {userAuth} = require('../middleware/auth');

requestRoute.use(userAuth,requestController);

module.exports= requestRoute;