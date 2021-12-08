const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsyncError');
const passport = require('passport');

const User = require('../models/user');
const jobDetails = require('../models/jobDetails');

router.get('/register',(req,res)=>{
    res.render('users/register');
});
router.post('/register', catchAsync(async (req,res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const regUser = await User.register(user,password);
        req.login(regUser, err => {
            if(err) return next(err);
            req.flash('success','Welcome to your job board account');
            res.redirect('/jobs');
        })

    }catch (e){

        req.flash('error', e.message);
        res.redirect('register');
    }    
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureFlash: true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome Back');
    const lastpage = req.session.returnTo || '/jobs';
    delete req.session.returnTo;
    res.redirect(lastpage);

});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success',"logout succeed!");
    res.redirect('/jobs');
})

router.get('/favorite', catchAsync(async(req, res) => {
    console.log(req.user.favorite)
    res.render('users/fav')
}));

router.post('/favorite', catchAsync(async(req, res) => {
    const job = new jobDetails()
    res.render('users/fav')
}));



module.exports = router;