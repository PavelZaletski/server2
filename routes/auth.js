var express = require('express');
var router = express.Router();
var passport = require('passport')
  
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', scope: [
    'email',
    'publish_actions',
    'user_friends',
    'user_about_me',
    'user_birthday'
    ]
  }),
  function(req, res) {
    res.redirect('/news');
  }
);

module.exports = router;