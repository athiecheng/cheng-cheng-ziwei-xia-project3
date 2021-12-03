const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsyncError');
const JobDetail = require('../models/jobDetails');
const {isLoggedIn, isAuthor, validateJob} = require('../middleware');


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
    job.author = req.user._id;
    await job.save();
    req.flash('sucess', 'Successfully post a job!');
    res.redirect(`/jobs/${job._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const job = await JobDetail.findById(req.params.id).populate('author');
    console.log(job);
    res.render('jobs/detail', {job});
}));

router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(async (req, res) => {
    const { id } = req.params;
    const job = await JobDetail.findById(id);
    if(!job){
        req.flash('error', 'Cannot find the job!');
        return res.redirect('/jobs');
    }

    res.render('jobs/edit', {job})
}));

router.put('/:id', isLoggedIn, isAuthor, validateJob, catchAsync(async (req, res) => {
    const { id } = req.params;
    //const {id} = req.params;
    const job = await JobDetail.findByIdAndUpdate(id, {...req.body.job});
    req.flash('sucess', 'Successfully edit a job!');
    res.redirect(`/jobs/${job._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    await JobDetail.findByIdAndDelete(id);
    res.redirect('/jobs')
}));

module.exports = router;