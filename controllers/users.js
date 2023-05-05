const User = require ("../models/user");

module.exports.registerForm = (req, res) =>{
    res.render('users/register')
}

module.exports.newRegister = async (req,res,next)=> {
    try {
    const {email, username, password} = req.body;
    const user = new User ({email, username})
    const userPassword = await User.register(user, password)
    req.login (userPassword, err =>{  // when you register you don not need to sign in again
        if(err) return next(err);
        req.flash('success', 'Welcome to Camp')
        res.redirect ( '/campgrounds')
    })
    
    } catch (e) {
        
        req.flash('error',e.message)
        
        
        res.redirect('/register')
    }
    

}

module.exports.loginForm = (req,res) =>{
    res.render ('users/login')
}

module.exports.login = (req,res) => {
    req.flash ('success', 'Welcome back') ;
    res.redirect ('/campgrounds')
 }

 module.exports.logout = (req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err)
        }
    req.flash('success', 'Goodbye')
    res.redirect('/campgrounds')
    });
    

}