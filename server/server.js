const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { ObjectID } = require('mongodb');


const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => console.log(`Listening at port ${port}`));

module.exports = { app };

