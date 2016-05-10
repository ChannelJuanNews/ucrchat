var User = require('./models/user.js') // our user models for stuffs
var helper = require('./helper.js') // our helper functions

// app/routes.js
module.exports = function(app, passport) {
    // THIS WILL MAKE SURE THAT WE ARE LOGGED IN AND RENDER THE RIGHT VIEW
    app.get('/', function(req, res) {
        if (helper.isAuthenticated(req)){
            res.render('index.ejs', {user : req.user}); // load the index.ejs file
        }
        else {
            res.render('index.ejs', {user : null}); // load the index.ejs file
        }
    });

    // THIS WILL LOG US OUT FOR SURE MA NIGGA
    app.get('/logout', function(req, res) {
        helper.logout(req, res)
    });
};
