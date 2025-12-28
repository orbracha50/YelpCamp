const express = require('express');
const Campground = require('../models/campground');
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');
const { populate } = require('../models/review.js');
const campgrounds = require('../controllers/campground.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('campground[images]'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/addCamp', isLoggedIn, catchAsync(campgrounds.renderNewForm))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor,upload.array('campground[images]'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


module.exports = router;
