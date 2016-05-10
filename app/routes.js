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
            res.render('index.ejs', { user : null } ); // load the index.ejs file
        }
    });

    app.post('/signin', function(req, res){
        if (helper.emailExists(req)){
            res.redirect('/authenticate/' + req.body.email)
        }
        else {
            helper.verifyEmail(req, res);
        }
    });

    app.get('/authenticate/:id', test, passport.authenticate('local-signin', {
        successRedirect : '/chat',
        failureRedirect : '/error',
        failureFlash : true
    }), function(req, res){
        console.log(req.params);
    })

    app.get('/error', function(req, res){
        res.render('error', {err : null})
    })

    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

     // handle the callback after facebook has authenticated the user
     app.get('/auth/facebook/callback',
         passport.authenticate('facebook', {
             successRedirect : '/chat',
             failureRedirect : '/error',
             failureFlash : true
         }));

    // THIS WILL LOG US OUT FOR SURE MA NIGGA
    app.get('/logout', function(req, res) {
        helper.logout(req, res, passport)
    });
};

function test (req, res, next){
    console.log(req.params);
    next()
}
