if(process.env.NODE_ENV !== "production") {
    require ('dotenv').config()
} //environment variable (process.env.NODE_ENV), now we are running in develpomnent mode, so require dotenv
//and add this file to process.env in the node, so for example console.log(process.env.Secret) Secret is in the file

//const mongoose = require ("mongoose");
//const dbUrl = process.env.DB_URL
const mongoSanitize = require('express-mongo-sanitize');
const express = require("express");
const app = express ();
const path = require ("path");
//const {joiSchema, reviewSchema} = require ('./justjoischema');
const mongoose = require ("mongoose");
//const Campground = require('./models/campground')
const methodOverride = require ("method-override");
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash');
//const catchAsync = require("./helpers/catchAsync");
const helpError = require('./helpers/helpError');
//const Review = require ("./models/review");
const campgroundsRoute = require('./routes/campgrounds')
const reviewsRoute = require('./routes/review')
const userRoute = require('./routes/users')

const passport = require ('passport');
const LocalStrategy = require ('passport-local')
const User = require('./models/user')
const MongoStore = require('connect-mongo');//MongoDB  store session
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/camp'


//'mongodb://127.0.0.1:27017/camp'
mongoose.connect(dbUrl)
    
/*mongoose.connect.on('error', console.error.bind(console, "connection error"))
mongoose.connect.once('open', ()=>{
    console.log('Database connected')
})*/



/*.then (()=>{
        console.log ("mongoose open")
    })
    .catch(err=>{
        console.log("oh no mongoose not open")
        console.log(err)
    })*/



app.set ('views', path.join(__dirname, 'views'));
app.set ('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate) //<% layout('boilerplate') -%>
app.use(express.static('public'))
app.use(mongoSanitize()); //sanitizes user-supplied data to prevent MongoDB Operator req.body, req.query or req.params

const secret = process.env.SECRET || 'LordasRikis'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,// do not update if user refresh page
    crypto: {
        secret
    }
});

const sessionConfig = {
    store,
    name: 'session', // just session name, you can name it
    secret,
    resave: false,
    saveUninitialized: true,
    cookie : {
        httpOnly: true,
        //secure: true, https
        expires: Date.now()+1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use (passport.initialize())
app.use (passport.session())
passport.use (new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) //user in session
passport.deserializeUser(User.deserializeUser()) // out of session

app.use((req,res,next) => {
    res.locals.signedInUser = req.user // req.user it comes from passport its like from session about is user have id
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

// middelware
/*const validateCampground = (req,res,next)=>{
const {error} = joiSchema.validate(req.body);

if(error){
    const msg = error.details.map(el=>el.message).join(',')
    throw new helpError(msg, 400)
} else { next ()}
}*/

/*const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new helpError(msg, 400)
    } else { next ()}
}*/

app.use('/campgrounds', campgroundsRoute);
app.use ('/campgrounds/:id/reviews', reviewsRoute)
app.use('/', userRoute)

app.get('/', (req,res)=>{
    res.render('home')
})
/*
app.get('/campgrounds', catchAsync( async(req,res)=>{
   const campgrounds = await Campground.find({});
   res.render ('campgrounds/index', {campgrounds})
}))

app.get('/campgrounds/new', (req,res)=>{
    res.render ('campgrounds/new')
})

app.post('/campgrounds', validateCampground, async(req,res,next)=>{
    try{
        //if(!req.body.campground) throw new ExpressError('invalid data', 400)
    
   const campground = new Campground (req.body.campground)
   await campground.save();
   res.redirect(`/campgrounds/${campground._id}`)
    } catch(e){
        next(e)
    }
})

app.get('/campgrounds/:id', catchAsync( async(req,res)=> {
    const {id}= req.params
    const campground = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show', {campground})
}))

app.get('/campgrounds/:id/edit',catchAsync( async(req,res)=>{
    const {id}= req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit',{campground})
}))

app.put('/campgrounds/:id', validateCampground, catchAsync( async(req,res)=>{
    const{id}=req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete ('/campgrounds/:id', catchAsync( async(req,res)=>{
    const{id}= req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})) 

app.post('/campgrounds/:id/review', validateReview, catchAsync(async(req,res)=>{
    const {id}= req.params;
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req,res)=>{
    const{id, reviewId}= req.params
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
})) */



app.all('*', (req,res,next)=>{
    // you can write res.status(400).send ('oh noooooooo')
    next(new helpError('page not found', 404))
    
})

// middelware if there is an error. Error handler
app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message)err.message='Oh no something wrong'
    
    res.render ('error', {err})
})

const port = process.env.PORT || 3000

app.listen (port, ()=>
console.log(`im listening ${port}`))