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

router.get('/fav', catchAsync(async(req, res) => {
    // const jobs = await JobDetail.find({});
    // const{user} = await User.findById(req.params.id);
    const userId = req.user._id;
    const user = await User.findById(userId);
    // console.log(user + " user")
    const favJobs = user.favjob;
    //console.log(favJobs + " this is favJobs from user.js")
    res.render('users/fav', {favJobs});
}));

module.exports = router;