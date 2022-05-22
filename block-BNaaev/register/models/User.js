var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, minlength: 5 },
  age: { type: Number, require: true },
  phone: { type: Number, require: true },
}, {timestamps: true});

userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};


module.exports = mongoose.model('User', userSchema);