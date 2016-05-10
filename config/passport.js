var User = require('../app/models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy
var fb = require('./fb.js');


function validEmail(req){
    // this returns true if we have an @ucr.edu email
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([ucr]+\.)+[edu]{2,}))$/;
    return re.test(req.body.email);
}


// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        return done(null, user.ucrEmail);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            return done(err, user.ucrEmail);
        });
    });


    passport.use('local-signin', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, done) {
        console.log(req, email, done)

        process.nextTick(function() {

            console.log(email)

            if (req.params.id){ // if you send an ID that means you are clicking on the link in the email

                if (validEmail(req.params.id)){
                    User.findOne({ 'ucrEmail' :  req.params.id }, function(err, user) {
                        // if there are any errors, return the error
                        if (err){
                            console.log(err);
                            return done(err)
                        }
                        if (user) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, req.flash('signupMessage', 'You do not exist'));
                        }

                    });
                }
                else {
                    User.findOne({ 'url' :  req.params.id }, function(err, user) {
                        // if there are any errors, return the error
                        if (err){
                            console.log(err);
                            return done(err)
                        }
                        // check to see if theres already a user with that email
                        if (user) {
                            user.validEmail = true
                            user.save(function(err, user) {
                                if (err){
                                    console.log(err)
                                }
                                return done(null, user);
                            });
                        }
                        else {
                            return done(null, false, req.flash('signupMessage', 'You do not exist'));
                        }

                    });
                }
            }

            else { // else you are logging in
                User.findOne({ 'ucrEmail' :  req.body.email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err){
                        console.log(err);
                        return done(err)
                    }
                    if (user) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, req.flash('signupMessage', 'You do not exist'));
                    }

                });
            }

        });

    }));




    // =========================================================================
   // FACEBOOK ================================================================
   // =========================================================================
   passport.use(new FacebookStrategy({

       // pull in our app id and secret from our auth.js file
       clientID        : fb.clientID,
       clientSecret    : fb.clientSecret,
       callbackURL     : fb.callbackURL,
       passReqToCallback : true

   },

   // facebook will send back the token and profile
   function(req, token, refreshToken, profile, done) {

       // asynchronous
       process.nextTick(function() {

           if (req.user){
               user = req.user;
               // set all of the facebook information in our user model
               user.facebook.id    = profile.id; // set the users facebook id
               user.facebook.token = token; // we will save the token that facebook provides to the user
               user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
               user.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
               user.restrictedChat = false; // you can now use the giphy api

               // save our user to the database
               user.save(function(err, user) {
                   if (err){
                       console.log(err)
                       done(null, false, req.flash('signupMessage', 'error in saving user'));
                   }
                   // if successful, return the new user
                   done(null, newUser);
               });
           }
           else {
               // find the user in the database based on their facebook id
               User.findOne({ '_id' : req.params.id }, function(err, user) {

                   // if there is an error, stop everything and return that
                   // ie an error connecting to the database
                   if (err){
                       console.log(err)
                       done(err)
                   }

                   // if the user is found, then log them in
                   if (user) {

                       // set all of the facebook information in our user model
                       user.facebook.id    = profile.id; // set the users facebook id
                       user.facebook.token = token; // we will save the token that facebook provides to the user
                       user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                       user.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                       user.restrictedChat = false; // you can now use the giphy api

                       // save our user to the database
                       user.save(function(err, user) {
                           if (err){
                               console.log(err)
                               done(null, false, req.flash('signupMessage', 'error in saving user'));
                           }
                           // if successful, return the new user
                           done(null, newUser);
                       });
                   }
                   else {
                     done(null, false, req.flash('signupMessage', 'You do not exist in our db fb'));
                   }

               });
           }

           console.log(req)

       });

   }));
};
