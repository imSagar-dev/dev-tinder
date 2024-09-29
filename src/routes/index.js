const express = require('express');
const router = express.Router();

// imports all routes
const authRoute = require('./auth.routes');
const userRoute = require('./user.routes');
const requestRoute = require('./request.routes');

router.use('/',authRoute);
router.use('/user',userRoute)
router.use('/request',requestRoute)

module.exports = router;