const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const logTodoError = e => console.log('Unable to save todo', e);
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
}, logTodoError);

// User model
// email property - require it - trim it - set string, min length of 1
// Create a new one (see that one fails)

const User = mongoose.model('Users',
  {
    email: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
    }
  });

const newUserOK = new User({email: 'as@as.as'});
const newUserKO = new User({email: '    '});

newUserOK
  .save()
  .then((doc) => console.log('Saved todo', doc))
  .then(() => newUserKO.save())
  .then((doc) => console.error('This doc was not supossed to be saved', doc))
  .catch(error => console.log('User without email not saved, OK:', error));
