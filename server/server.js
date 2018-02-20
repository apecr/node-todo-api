const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const logError = e => console.log('Unable to save todo', e);
const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

const newTodo = new Todo({text: 'Edit this video', completed: false});

newTodo.save().then((doc) => {
  console.log('Saved todo', doc);
}, logError);
