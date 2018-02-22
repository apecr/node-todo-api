const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
  const token = jwt.sign({_id: this._id.toHexString(), access}, 'abc123').toString();
  this.tokens = this.tokens.concat([ {access, token} ]);
  return this.save().then(() => token);
};

UserSchema.methods.toJSON = function() {
  return _.pick(this.toObject(), ['_id', 'email']);
};

const User = mongoose.model('Users', UserSchema);

module.exports = {User};