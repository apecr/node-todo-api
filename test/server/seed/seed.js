const {Todo} = require('./../../../server/models/todo');
const {User} = require('./../../../server/models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const testTodos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

const usersTestIds = [{_id: new ObjectID()}, {_id: new ObjectID()}];

const testUsers = [{
  _id: usersTestIds[0]._id,
  email: 'alberto@example.com',
  password: 'userOnePass',
  tokens: [ {
    access: 'auth',
    token: jwt.sign({_id: usersTestIds[0]._id, access: 'auth'}, 'abc123').toString()
  } ]
}, {
  _id: usersTestIds[1]._id,
  email: 'eyo@example.com',
  password: 'userTwoPass'
}];

const populateTodos = () => Todo.remove({}).then(() => Todo.insertMany(testTodos));
const populateUsers = () => {
  return User.remove({})
    .then(() => testUsers.map(user => new User(user).save()))
    .then(usersPromise => Promise.all(usersPromise));
};

module.exports = {
  testTodos,
  populateTodos,
  testUsers,
  populateUsers
};