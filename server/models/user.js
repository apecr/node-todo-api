const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let User;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email!'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [ {
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  } ]
});

UserSchema.methods.generateAuthToken = function() {
  const access = 'auth';
  const token = jwt.sign({_id: this._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  this.tokens = this.tokens.concat([ {access, token} ]);
  return this.save().then(() => token);
};

UserSchema.methods.toJSON = function() {
  return _.pick(this.toObject(), ['_id', 'email']);
};

UserSchema.statics.findByToken = function(token) {
  let decoded = undefined;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }
  return this.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.finByCredentials = function(email, password) {
  return User.findOne({email})
    .then(user => (user ? bcrypt.compare(password, user.password) : Promise.reject({errorMessage: 'User not found'}))
      .then(areTheSame => areTheSame ? user : Promise.reject({errorMessage: 'Not the same password'})));
};

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(this.password, salt))
      .then(hash => this.password = hash)
      .then(() => next());
  } else {
    next();
  }
});

UserSchema.methods.removeToken = function(token) {
  return this.update({
    $pull: {
      tokens: {
        token
      }
    }
  });

};

User = mongoose.model('Users', UserSchema);


module.exports = {User};