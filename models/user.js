const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type:String,
        required: true,
        unique: true
    },
    favjob: [String]
})

UserSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model('User',UserSchema);