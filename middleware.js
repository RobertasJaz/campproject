// its middelware so you need req,res,next
// isAuthenticated coming from passport
const {joiSchema, reviewSchema} = require ('./justjoischema')
const helpError = require('./helpers/helpError');
const Campground = require('./models/campground')
const Review = require ("./models/review");


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'you must sign in')
        return res.redirect('/login')
    }
    next()
}



module.exports.validateCampground = (req,res,next)=>{
    const {error} = joiSchema.validate(req.body);
    
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new helpError(msg, 400)
    } else { next ()}
    }

    module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
     if(!campground.author.equals(req.user.id)){
        req.flash('error', 'you do not have permission')
        return res.redirect(`/campgrounds/${id}`)
     }
     next()
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new helpError(msg, 400)
    } else { next ()}
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
     if(!review.author.equals(req.user.id)){
        req.flash('error', 'you do not have permission')
        return res.redirect(`/campgrounds/${id}`)
     }
     next()
}