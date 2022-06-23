var express = require('express');
var router = express.Router();
var Blog = require('../models/Blog');

/* GET home page. */
router.get('/', function (req, res, next) {
  Blog.find({}, (err, blog) => {
    if (err) return next(err);
    res.render('index', { blog: blog });
  });
});

module.exports = router;