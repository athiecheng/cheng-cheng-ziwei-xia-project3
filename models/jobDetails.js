const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const JobDetailsSchema = new Schema({
    title: String,
    logo: String,
    company: String,
    location: String,
    description: String,
    email: String,
    website: String,
    postingDate: {
        type: Date,
        default: Date.now,
    }, 
    favorited: Number
})

module.exports = mongoose.model('JobDetail', JobDetailsSchema)