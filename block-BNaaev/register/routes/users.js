var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
});

router.get("/users/register", (req,res,next) => {
  res.render('register')
})

router.post("/users/login", (req,res,next) => {
  res.render('login')
})

module.exports = router;
