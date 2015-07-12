var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  if (req.user) { return res.redirect('/'); }
  return res.render('login', { title: 'Express' });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

module.exports = router;
