//allows us to access it from other files
module.exports = {
   ensureAuthenticated: function(req, res, next){
      if(req.isAuthenticated()){
         return next();
      }
      req.flash('error_msg', 'Not Authorized: Please Login.')
      res.redirect('/users/login');
   }
}