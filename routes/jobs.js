const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsyncError');
const ExpressError = require('../helpers/ExpressError');
const JobDetail = require('../models/jobDetails');
const {jobSchema} = require('../joiSchemas');
const {isLoggedIn} = require('../middleware');
//middleware to validate job
const validateJob = (req, res, next) => {
    const {error} = jobSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async(req, res) => {
    const jobs = await JobDetail.find({});
    res.render('jobs/index', {jobs})
}));

router.get('/new', isLoggedIn,(req, res) => {
    
    res.render('jobs/new');
});

router.post('/',isLoggedIn, validateJob,catchAsync(async (req, res, next) => {
    // if (!req.body.job) throw new ExpressError('Invalid job data', 400);
    
    const job = new JobDetail(req.body.job);
    await job.save();
    req.flash('sucess', 'Successfully post a job!');
    res.redirect(`/jobs/${job._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const job = await JobDetail.findById(req.params.id)
    res.render('jobs/detail', {job});
}));

router.get('/:id/edit', isLoggedIn,catchAsync(async (req, res) => {
    const job = await JobDetail.findById(req.params.id)
    res.render('jobs/edit', {job})
}));

router.put('/:id', validateJob, catchAsync(async (req, res) => {
    const {id} = req.params;
    const job = await JobDetail.findByIdAndUpdate(id, {...req.body.job});
    req.flash('sucess', 'Successfully edit a job!');
    res.redirect(`/jobs/${job._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await JobDetail.findByIdAndDelete(id);
    res.redirect('/jobs')
}));

module.exports = router;