const express = require('express');
const Campground = require('../models/campground');
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const { isLoggedIn,validateCampground,isAuthor } = require('../middleware.js');
const { populate } = require('../models/review.js');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));
router.get('/addCamp',isLoggedIn, (req, res) => {
    res.render('campgrounds/addCamp');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({path:'reviews',populate: 'author'}).populate('author');
    const currentUser = (req.user) ? req.user : ''
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/details', { campground, currentUser });
}));

router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn,isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    if (!campground) {
        req.flash('error', 'Cannot update that campground!');
        return res.redirect('/campgrounds');
    }
    req.flash('success', `Successfully updated ${campground.name} campground!`);
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedIn,isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
        req.flash('error', 'Cannot delete that campground!');
        return res.redirect('/campgrounds');
    }
    req.flash('success', `Successfully delete ${campground.name} campground!`);
    res.redirect('/campgrounds');
}))

module.exports = router;
