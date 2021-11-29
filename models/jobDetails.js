const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const JobDetailsSchema = new Schema({
    title: String,
    company: String,
    location: String,
    description: String,
    employerEmail: String,
    postingDate: Number, 
    favorited: Number
})

module.exports = mongoose.model('JobDetail', JobDetailsSchema)