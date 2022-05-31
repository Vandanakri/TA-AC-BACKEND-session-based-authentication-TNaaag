var express = require('express');
var router = express.Router();
var User = require('../models/User')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users');
});

router.get('/register', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('register', { error });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) {
      if(err.name === 'MongoError') {
        req.flash('error', 'This email is already exist');
        return res.redirect('/users/register')
      }
      if(err.name === 'ValidationError'){
        req.flash('error', 'Password must be greater than 4 digit');
        return res.redirect('/users/register')
      }
      return res.json({ err });
    }
    res.redirect('/users/login');
  })
});
//login form
router.get('/login', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('login', { error });
});

//login handler
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/Password required');
    return res.redirect('/users/login')
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    // no user
    if (!user) {
      req.flash('error', 'Email is not registered');
      return res.redirect('/users/login');
    }
    // compare password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Password is wrong');
        return res.redirect('/users/login')
      }
      // persist logged in user information
      req.session.userId = user.id;
      res.redirect('/users');
    })
  })
})
// log out
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});

module.exports = router;
