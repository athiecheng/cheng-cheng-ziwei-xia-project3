const { boolean } = require("webidl-conversions");

const mongoose = requre('mongoose');
const Schema = mongoose.Schema;


const JobDetailsSchema = new Schema({
    title: String,
    company: String,
    location: String,
    description: String,
    employerEmail: String,
    postingDate: String, 
    favorited: boolean
})

module.exports = mongoose.model('JobDetails', JobDetailsSchema)