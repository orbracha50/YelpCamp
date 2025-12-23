const express = require('express');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review.js')
const router = express.Router({ mergeParams: true })


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log
    const review = new Review(req.body.review);
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

router.delete('/:reviewId', catchAsync(async (req, res) => {
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