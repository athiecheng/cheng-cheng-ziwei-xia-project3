const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const JobDetailsSchema = new Schema({
    title: String,
    logo: String,
    company: String,
    location: String,
    description: String,
    email: String,
    postingDate: Number, 
    favorited: Number
})

module.exports = mongoose.model('JobDetail', JobDetailsSchema)