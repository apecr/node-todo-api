const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Todo.remove({}).then(console.log);

// Todo.findOneAndRemove({_id: '5a8d1d6313d3d432527be703'}).then(console.log);
// Todo.findByIdAndRemove('5a8d1d6313d3d432527be703').then(console.log);