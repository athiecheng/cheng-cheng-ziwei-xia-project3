const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/job-details', async (req, res) => {
    const jobs = await JobDetail.find({});
    res.render('jobs/index', {jobs})
})

app.get('/job-details/:id', async (req, res) => {
    const job = await JobDetail.findById(req.params.id)
    res.render('jobs/detail', {job})
})

app.listen(3000, ()=> {
    console.log('Serving on port 3000')
})