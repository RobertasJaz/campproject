const express = require("express");
const User = require ("../models/user");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const passport = require("passport");

const users = require ('../controllers/users')

router.route('/register')
    .get ( users.registerForm)  // no semicolons
    .post (catchAsync(users.newRegister))

//router.get ( '/register', users.registerForm)
//router.post ('/register',catchAsync(users.newRegister))

router.route('/login')
    .get (users.loginForm)
    .post (passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}),users.login)

//router.get ('/login', users.loginForm)
//router.post ('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}),users.login)

// methods logout login comes from passport
router.get ('/logout', users.logout);

module.exports = router ; 