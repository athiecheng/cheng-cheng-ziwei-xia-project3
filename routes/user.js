const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsyncError');
const passport = require('passport');

const User = require('../models/user');

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
        console.log("sssss")
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

module.exports = router;