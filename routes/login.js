const express = require('express');
const router = express.Router();
const passport = require('passport')

router.post('/', 
  passport.authenticate('local', { 
    successRedirect: '/news',
    failureRedirect: '/error',
    failureFlash: false 
  })
);

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

module.exports = router;
