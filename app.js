const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
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

app.post('/jobs', async (req, res) => {
    const job = new JobDetail(req.body.job);
    await job.save();
    res.redirect(`/jobs/${job._id}`)
});

app.get('/jobs/:id', async (req, res) => {
    const job = await JobDetail.findById(req.params.id)
    res.render('jobs/detail', {job})
});

app.get('/jobs/:id/edit', async (req, res) => {
    const job = await JobDetail.findById(req.params.id)
    res.render('jobs/edit', {job})
});

app.put('/jobs/:id', async (req, res) => {
    const {id} = req.params;
    const job = await JobDetail.findByIdAndUpdate(id, {...req.body.job});
    res.redirect(`/jobs/${job._id}`)
})

app.delete('/jobs/:id', async (req, res) => {
    const {id} = req.params;
    await JobDetail.findByIdAndDelete(id);
    res.redirect('/jobs')
})

app.listen(3001, ()=> {
    console.log('Serving on port 3000')
})