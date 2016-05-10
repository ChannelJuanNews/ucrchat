// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    validEmail : Boolean

});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
