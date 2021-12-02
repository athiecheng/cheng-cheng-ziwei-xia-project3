const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const {jobSchema} = require('./joiSchemas');
const catchAsync = require('./helpers/catchAsyncError');
const ExpressError = require('./helpers/ExpressError');
const methodOverride = require('method-override');
const JobDetail = require('./models/jobDetails');
const jobs = require('./route/jobs');

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

app.use("/jobs",jobs)

app.get('/', (req, res) =>{
    res.render('home')
})



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