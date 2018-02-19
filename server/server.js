const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const logError = e => console.log('Unable to save todo', e);
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

const newTodo = new Todo({text: 'Get back home', completed: true, completedAt: 20180219});

newTodo.save().then((doc) => {
  console.log('Saved todo', doc);
}, logError);
