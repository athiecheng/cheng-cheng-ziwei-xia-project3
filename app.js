const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const {jobSchema} = require('./joiSchemas');
const catchAsync = require('./helpers/catchAsyncError');
const ExpressError = require('./helpers/ExpressError');
const methodOverride = require('method-override');
const JobDetail = require('./models/jobDetails');

mongoose.connect('mongodb://localhost:27017/job-search', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Database connected");
})

const app = express();

app.engine('ejs',ejsmate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

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

app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/jobs', async (req, res) => {
    const jobs = await JobDetail.find({});
    res.render('jobs/index', {jobs})
})

app.get('/jobs/new', async (req, res) => {
    res.render('jobs/new');
});

app.post('/jobs', validateJob,catchAsync(async (req, res, next) => {
    // if (!req.body.job) throw new ExpressError('Invalid job data', 400);
    const job = new JobDetail(req.body.job);
    await job.save();
    res.redirect(`/jobs/${job._id}`)
}));

app.get('/jobs/:id', catchAsync(async (req, res) => {
    const job = await JobDetail.findById(req.params.id)
    res.render('jobs/detail', {job})
}));

app.get('/jobs/:id/edit', catchAsync(async (req, res) => {
    const job = await JobDetail.findById(req.params.id)
    res.render('jobs/edit', {job})
}));

app.put('/jobs/:id', validateJob, catchAsync(async (req, res) => {
    const {id} = req.params;
    const job = await JobDetail.findByIdAndUpdate(id, {...req.body.job});
    res.redirect(`/jobs/${job._id}`)
}));

app.delete('/jobs/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await JobDetail.findByIdAndDelete(id);
    res.redirect('/jobs')
}));

app.all('*', (req, res, next)=> {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', {err});
})

app.listen(3000, ()=> {
    console.log('Serving on port 3000')
})