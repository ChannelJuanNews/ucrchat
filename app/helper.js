
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
        if (req.isAuthenticated()){
            return true
        }
        return false
    },

    logout : function(req, res){
        req.logout();
        res.redirect('/');
    },

    verifyEmail : function(req,res){

        if (!validEmail(req)){
            res.redirect('/')
        }
        else {
            // If We have a valid email address then save the user and send out email
            newUser = new User();
            newUser.ucrEmail = req.body.email;
            newUser.validEmail = false;
            newUser.restrictedChat = true;


            console.log(newUser)

            newUser.save(function(err, user){
                if (err){
                    console.log(err)
                    res.render('error', {err : err});
                }
                else {

                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: 'ucrchat@gmail.com', // sender address
                        to: req.body.email, // list of receivers
                        subject: 'UCR chat email verification', // Subject line
                        html: '<b>Hello Highlander!</b><p>To verify your email click this link http://localhost:3000/authenticate/' + user.generateURL(user.id) + '</p>',
                        alternatives: [
                            {
                                contentType: 'text/x-web-markdown',
                                content: '**Hello world!**'
                            }
                        ]
                    };

                    console.log(user)
                    // send mail with defined transport object
                      transporter.sendMail(mailOptions, function(err, info){
                          if(err){
                              console.log(err);
                              res.render('errror', { err : err } );
                          }
                          console.log('Message sent: ' + info.response);
                          res.render('index', { user : user } );
                      });

                }
            })
        }

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



}


module.exports = helper;
