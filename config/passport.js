const LocalStrategy  = require('passport-local').Strategy,
      mongoose       = require('mongoose'),
      bcrypt         = require('bcryptjs');

//Load user model
const User = mongoose.model('users');

module.exports = function(passport){
   passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
      //Match User
      User.findOne({
         email:email
      }).then(user => {
         if(!user){
            return done(null, false, {message: 'Error: No User Found'});
         }
         //Match Password
         bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
               return done(null, user);
            } else {
               return done(null, false, {message: 'Error: Incorrect Password'});
            }
         })
      })
   })); 
   passport.serializeUser(function(user, done) {
      done(null, user.id);
   });
   passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
         done(err, user);
      });
         //findById, in this case, will work perfectly because this is a Mongoose function; it may not work with other ORM's
   });
}