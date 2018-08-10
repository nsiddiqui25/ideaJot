const express  = require('express'),
      mongoose = require('mongoose'),
      router   = express.Router();

//Load Authentication
const {ensureAuthenticated} = require('../helpers/auth');

//Load Idea Model
require('../models/Ideas');
const Idea = mongoose.model('ideas');

//Idea Index Page
router.get('/', ensureAuthenticated,(req, res) => {
   Idea.find({user: req.user.id})
      .sort({date:'desc'})
      .then(ideas => {
         res.render('ideas/index', {
            ideas:ideas
         });
      });
});

//Add Idea Form
router.get("/add", ensureAuthenticated, (req, res) => {
   res.render("ideas/add");
});

//Edit Idea Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
   Idea.findOne({
      _id: req.params.id
   })
   .then(idea => {
      if(idea.user != req.user.id){
         req.flash('error_msg', 'Not Authorized.');
         res.redirect('ideas/edit');
      } else {
         res.render("ideas/edit", {
            idea:idea
         });
      }
   });
});

//Process Form
router.post('/', ensureAuthenticated, (req, res) => {
   let errors = [];
      //set errors to an empty array
   if(!req.body.title){
      errors.push({text: 'Please add a title'});
   }
   if(!req.body.details){
      errors.push({text: 'Please include a brief detail'});
   }
   //check to see length of errors array
   if(errors.length>0){
      res.render('ideas/add', {
         errors: errors,
         title: req.body.title,
         details: req.body.details
      });
   } else {
      const newUser = {
         title: req.body.title,
         details: req.body.details,
         user: req.user.id
      }
      new Idea(newUser)
         .save()
         .then(idea => {
            req.flash('success_msg', 'New Idea Added!');
            res.redirect('/ideas');
         })
   }
});

//Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
   //res.send('PUT');
   Idea.findOne({
      _id: req.params.id
   })
   .then(idea => {
      //new values (change to edited idea)
      idea.title = req.body.title;
      idea.details = req.body.details;
      //save edited idea
      idea.save()
         .then(idea => {
            req.flash('success_msg', 'Idea updated!');
            res.redirect('/ideas');
         });
   });
});

//Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
   //res.send('DELETE');
   Idea.remove({
      _id: req.params.id
   })
   .then(() => {
      req.flash('success_msg', 'Idea removed!');
      res.redirect('/ideas');
   });
});

//to export to use in other files
module.exports = router;