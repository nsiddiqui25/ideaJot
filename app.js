const express        = require('express'),
      path           = require('path'),
      exphbs         = require('express-handlebars'),
      methodOverride = require('method-override'),
      flash          = require('connect-flash'),
      session        = require('express-session'),
      bodyParser     = require('body-parser'),
      passport       = require('passport'),
      mongoose       = require('mongoose'),
      app            = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/database');

//Map global promise - get rid of warning - wasn't getting warning to begin with, but thanks anyways Brad!
mongoose.Promise = global.Promise;

//Connect to Mongoose
mongoose.connect(db.mongoURI)
   .then(() => console.log('MongoDB Connected......'))
   .catch(err => console.log(err));

//Middleware
   // Handlebars Middleware
      app.engine('handlebars', exphbs({
         defaultLayout: 'main'
      }));
      app.set('view engine', 'handlebars');
   //Body-Parser Middleware
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());
   //Static folder Middleware
      app.use(express.static(path.join(__dirname, 'public')));
   //Method-override Middleware
      app.use(methodOverride('_method'));
   //Express-Session Middleware
      app.use(session({
         secret: 'secret',
         resave: true,
         saveUninitialized: true
      }));
   //Passport Middle - VERY IMPORTANT THAT THIS GOES AFTER EXPRESS-SESSION
      app.use(passport.initialize());
      app.use(passport.session());
   //Connect-Flash Middleware
      app.use(flash());

//Global variables
app.use(function (req, res, next) {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   res.locals.user = req.user || null;
   
   next();
});

//Index Route
app.get("/", (req, res) => {
   const title = "Welcome";
   res.render('index', {
      title: title
   });
});

//About Route
app.get("/about", (req, res) => {
   res.render("about");
});

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
   console.log(`Server started on port ${port}`)
});