const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const logError = e => console.log('Unable to save todo');
const Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

const newTodo = new Todo({text: 'Cook dinner'});

newTodo.save().then((doc) => {
  console.log('Saved todo', doc);
}, logError);
