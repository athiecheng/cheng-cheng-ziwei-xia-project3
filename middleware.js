const {jobSchema} = require('./joiSchemas');
const ExpressError = require('./helpers/ExpressError');
const JobDetail = require('./models/jobDetails');

module.exports.isLoggedIn = (req, res, next) =>{
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','need to be login to post job')
        return res.redirect('/login');
    }
    next();
}

//middleware to validate job
module.exports.validateJob = (req, res, next) => {
    const {error} = jobSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const job = await JobDetail.findById(id);
    if(!job.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/jobs/${id}`);
    }
    next();
}