const config = require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {logger} = require('./utils/logger');

const env = config.prepareEnvironment();
logger.info(`env ***** ${env}`);

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { ObjectID } = require('mongodb');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({ text: req.body.text });
  return todo
    .save()
    .then(doc => res.status(201).send(doc))
    .catch((error) => res.status(400).send(error));
});

app.get('/todos', (req, res) => {
  return Todo
    .find()
    .then((todos) => res.send({ todos }))
    .catch((error) => res.status(400).send(error));
});

app.get('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }
  return Todo
    .findById(req.params.id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      return res.status(200).send({ todo });
    })
    .catch(() => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }
  return Todo.findByIdAndRemove(req.params.id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      return res.status(200).send({ todo });
    }).catch(() => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
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
    .findByIdAndUpdate(req.params.id, { $set: body }, {new: true})
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.status(200).send({todo});
    })
    .catch(() => res.status(404).send());

});

// POST /users
// use pick for the properties
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  return new User(body)
    .save()
    .then(newUser => res.status(201).send(newUser))
    .catch(error => res.status(400).send(error));
});

app.listen(process.env.PORT, () => logger.info(`Listening at port ${process.env.PORT}`));

// Export
module.exports = { app };

