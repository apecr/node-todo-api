const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// const id = '5a8c30467f28de461370940011';

// Todo
//   .find({_id: id})
//   .then((todos) => console.log('Todos', todos))
//   .catch(console.log);

// Todo
//   .findOne({completed: false})
//   .then((todo) => console.log('Todo', todo))
//   .catch(console.log);

// if (!ObjectID.isValid(id)) {
//   return console.log('ID not valid');
// }
// Todo
//   .findById(id)
//   .then((todo) => {
//     if (!todo) {
//       return console.log('Id not found');
//     }
//     console.log('Todo By Id', todo);
//   })
//   .catch(console.log);

// Query the users collection
// User.findById --> query works but no user; user found; errors may ocurred
const id = '5a8bcf338d5bc61da762acf2';
User
  .findById(id)
  .then(user => {
    if (!user) {
      return console.log('User not found');
    }
    console.log('User fetched ok', JSON.stringify(user, undefined, 2));
  })
  .catch(console.log);