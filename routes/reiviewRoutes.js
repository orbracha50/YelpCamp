const express = require('express');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review.js')
const router = express.Router({ mergeParams: true })
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware.js')


router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.review);
    review.author = req.user._id 
    console.log('check' , review)
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot add review');
        return res.redirect('/campgrounds');
    }
    if (campground.reviews) {
        campground.reviews.push(review)
    } else {
        campground.reviews = [review]
    }
    await review.save()
    await campground.save()
    
    req.flash('success', `Successfully add review!`);
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    const campground = await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });
    if (!campground) {
        req.flash('error', 'Cannot delete that campground!');
        return res.redirect('/campgrounds');
    }
    req.flash('success', `Successfully deleted review!`);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;