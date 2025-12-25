const express = require('express');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review.js')
const router = express.Router({ mergeParams: true })
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware.js')
const reviews = require('../controllers/review.js')

router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;