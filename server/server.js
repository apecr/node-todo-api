const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());
app.post('/todos', (req, res) => {
  const todo = new Todo({text: req.body.text});
  return todo
    .save()
    .then(doc => res.status(201).send(doc))
    .catch((error) => res.status(400).send(error));
});

// GET /todos
// GET /todos/1255092edef

app.get('/todos', (req, res) => {
  return Todo
    .find()
    .then((todos) => res.send({todos}))
    .catch((error) => res.status(400).send(error));
});

app.listen(3000, () => console.log('Started on port 3000'));

module.exports = {app};

