const express = require("express");
const router = express.Router({mergeParams:true}); // pass query params from index.js
const catchAsync = require("../helpers/catchAsync");
const helpError = require('../helpers/helpError');
const Campground = require('../models/campground')
const Review = require ("../models/review");
//const {reviewSchema} = require ('../justjoischema');
const {validateReview, isLoggedIn, isReviewAuthor} = require ('../middleware')

const reviews = require ('../controllers/reviews')


/*const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new helpError(msg, 400)
    } else { next ()}
}*/



router.post('/',isLoggedIn, validateReview, catchAsync(reviews.newReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview)) 

module.exports = router ;