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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postingDate: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('JobDetail', JobDetailsSchema)