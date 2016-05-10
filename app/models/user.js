// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    ucrEmail        : {unique : true, type : String },
    validEmail      : Boolean,
    restrictedChat  : Boolean,
    giphyEnabled    : Boolean,
    url : String

});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.generateURL = function(id) {
    hash = bcrypt.hashSync(id, bcrypt.genSaltSync(8), null);
    this.url = hash;
    this.save(function(err){
        if (err){
            console.log(err)
            return 'ERROR'
        }
    })
    return hash
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
