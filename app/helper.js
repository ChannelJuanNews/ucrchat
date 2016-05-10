
var User = require('./models/user.js');
var nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ucrchat@gmail.com',
        pass: process.env.ucremailpass
    }
});

function validEmail(req){
    // this returns true if we have an @ucr.edu email
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([ucr]+\.)+[edu]{2,}))$/;
    return re.test(req.body.email);
}


var helper = {

    isAuthenticated : function(req){
        if (req.isAuthenticated){
            return true
        }
        return false
    },

    logout : function(req, res){
        req.logout();
        res.redirect('/');
    },

    validEmail : function(req){
        // this returns true if we have an @ucr.edu email
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([ucr]+\.)+[edu]{2,}))$/;
        return re.test(req.body.email);
    },

    verifyEmail : function(req,res){

        if (!validEmail(req)){
            res.send('invalid email')
        }

        // If We have a valid email address then save the user and send out email
        newUser = new User();
        newUser.ucrEmail = req.body.email;
        newUser.validEmail = false;
        newUser.restrictedChat = true;

        console.log(newUser)

        newUser.save(function(err, user){
            if (err){
                console.log(err)
                return
            }
            else {

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: 'ucrchat@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: 'UCR chat email verification', // Subject line
                    html: '<b>Hello world!</b>',
                    alternatives: [
                        {
                            contentType: 'text/x-web-markdown',
                            content: '**Hello world!**'
                        }
                    ]
                };

                // send mail with defined transport object
                  transporter.sendMail(mailOptions, function(err, info){
                      if(err){
                          res.send({done: true})
                          return console.log(err);
                      }
                      console.log('Message sent: ' + info.response);
                      res.send({done:true})
                  });

            }
        })
    },

    emailExists : function(req){
        User.find({ucrEmail : req.body.email}, function(err, user){
            if (err){
                console.log(err)
            }
            else {
                if (user){
                    return true
                }
                else {
                    return false
                }
            }
        })
    },

    authenticate : function(req, res, passport){
        passport.authenticate('local-signin', {
            successRedirect : '/',
            failureRedirect : '/error',
            failureFlash : true
        })
    }


}


module.exports = helper;
