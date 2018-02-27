const config = require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const {logger} = require('./utils/logger');

const env = config.prepareEnvironment();
logger.info(`env ***** ${env}`);

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  return todo
    .save()
    .then(doc => res.status(201).send(doc))
    .catch((error) => res.status(400).send(error));
});

app.get('/todos', authenticate, (req, res) => {
  return Todo
    .find({_creator: req.user._id})
    .then((todos) => res.send({ todos }))
    .catch((error) => res.status(400).send(error));
});

app.get('/todos/:id', authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }
  return Todo
    .findOne({
      _id: req.params.id,
      _creator: req.user._id
    })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      return res.status(200).send({ todo });
    })
    .catch(() => res.status(400).send());
});

app.delete('/todos/:id', authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }
  return Todo.findOneAndRemove({
    _id: req.params.id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      return res.status(200).send({ todo });
    }).catch(() => res.status(400).send());
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  return Todo
    .findOneAndUpdate({
      _id: req.params.id,
      _creator: req.user._id
    },
    { $set: body },
    {new: true})
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.status(200).send({todo});
    })
    .catch(() => res.status(404).send());

});


app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);
  return user
    .save()
    .then(() => user.generateAuthToken())
    .then(token => res.status(201).header('x-auth', token).send(user))
    .catch(error => res.status(400).send(error));
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  return User.finByCredentials(body.email, body.password)
    .then(user => user.generateAuthToken()
      .then(token => res.status(201).header('x-auth', token).send(user)))
    .catch(error => {
      return res.status(400).send(error);
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  return req.user.removeToken(req.token)
    .then(() => res.status(200).send())
    .catch(() => res.status(400).send());
});

app.listen(process.env.PORT, () => logger.info(`Listening at port ${process.env.PORT}`));

// Export
module.exports = { app };

