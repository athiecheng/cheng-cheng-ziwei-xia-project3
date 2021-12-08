const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsyncError');
const JobDetail = require('../models/jobDetails');
const {isLoggedIn, isAuthor, validateJob} = require('../middleware');
const user = require('../models/user');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        
        JobDetail.find({company: regex}, function(err, allJobs){
           if(err){
               console.log(err);
           } else {
              if(allJobs.length < 1) {
                  noMatch = "No jobs match that query, please try again.";
              }
              console.log(allJobs);
              res.render("jobs/index",{Jobdetails:allJobs, noMatch: noMatch});
           }
        });
    } else {
        
        JobDetail.find({}, function(err, allJobs){
        
           if(err){
               console.log(err);
           } else {
            console.log(allJobs +"lllll");
              res.render("jobs/index",{Jobdetails:allJobs, noMatch: noMatch});
           }
        });
    }
});


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

router.post('/:id',isLoggedIn, catchAsync(async (req, res, next) => {
    // if (!req.body.job) throw new ExpressError('Invalid job data', 400);
    const{id} = req.params;
    const{user} = await User.findById(req.params.id);
    if (user.favjob.includes(id)){
        user.favjob.delete(id)
    }else{
        user.favjob.push(id)
    }
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