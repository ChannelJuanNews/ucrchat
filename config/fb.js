module.exports = {
    'clientID'      : process.env.FB_CHAT_ID,
    'clientSecret'  : process.env.FB_CHAT_SECRET,
    'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
}
