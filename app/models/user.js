// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({


    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    ucrEmail        : String,
    validEmail      : Boolean,
    restrictedChat  : Boolean

});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
