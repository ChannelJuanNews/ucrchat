var helper = {
    isAuthenticated : function(req){
        if (req.isAuthenticated){
            return true
        }
        return false
    },

    logout(req, res){
        req.logout();
        res.redirect('/');
    }
}


module.exports = helper;
