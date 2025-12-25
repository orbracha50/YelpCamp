const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/user')

router.route('/register')
    .get(catchAsync(users.renderRegister))
    .post(catchAsync(users.register))

router.route('/login')
    .get(catchAsync(users.renderLogin))
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.login))

router.get('/logout', catchAsync(users.logout));

module.exports = router;