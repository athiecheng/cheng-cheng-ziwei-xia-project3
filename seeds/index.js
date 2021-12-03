const mongoose = require('mongoose');
const jobs = require('./jobs');
const JobDetail = require('../models/jobDetails');

mongoose.connect('mongodb://localhost:27017/job-search', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Database connected");
})

// const seedDB = async () => {
//     await JobDetail.deleteMany({})
//     for(let i = 0; i < 10; i++){
//         const random3 = Math.floor(Math.random() * 3);
//         const job = new JobDetail({
//             author: '61aa84a23152e89228fb7b3c',
//             title: `${jobs[random3].title}`,
//             location: `${jobs[random3].location}`,
//             image:'https://unsplash.com/collections/1117915'
//         })
//         await job.save();
//     }
// }

seedDB().then(()=> {
    mongoose.connection.close();
});