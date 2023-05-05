const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
//const helpError = require('../helpers/helpError');
const Campground = require('../models/campground')
//const Review = require ("../models/review");
//const {joiSchema} = require ('../justjoischema');
const {isLoggedIn, validateCampground,isAuthor}= require ('../middleware')
const multer = require ('multer') // parsing images from the form. multer a package name
const {storage} = require('../cloudinary')
const upload = multer ({storage})
const campgrounds = require ('../controllers/campgrounds')



router.get('/', catchAsync(campgrounds.index))
 
 router.get('/new', isLoggedIn, campgrounds.newForm)
 
//router.post ('/', upload.array('image'), (req,res) => {
    //res.send ('its working')

//})
router.post('/', isLoggedIn, upload.array('image'),  validateCampground,  campgrounds.newCamp)
// input field name image
 
 router.get('/:id', catchAsync(campgrounds.showCamp))
 
 router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.editCampForm))
 
 router.put('/:id', isLoggedIn, isAuthor, upload.array('image'),  validateCampground, catchAsync( campgrounds.updateCamp))
 
 router.delete ('/:id', isLoggedIn, isAuthor, catchAsync( campgrounds.deleteCamp))

 module.exports = router;
 