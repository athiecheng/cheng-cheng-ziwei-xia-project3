module.exports.isLoggedIn = (req, res, next) =>{

    if (!req.isAuthenticated()){
        
        req.session.returnTo = req.originalUrl;
        
        req.flash('error','need to be login to post job')
        return res.redirect('/login');
    }
    next();
}