const {MongoClient, ObjectID} = require('mongodb');

const concatError = (error) => `Unable to connect to MongoDB server: ${error}`;
const consoleErrorMongo = (error, db) => console.log(concatError(error));

// deleteMany
// deleteOne
// findOneAndDelete


// let clientDB = {};
// MongoClient.connect('mongodb://localhost:27017/TodoApp')
//   .then((client) => {
//     clientDB = client;
//     return client.db('TodoApp');
//   })
//   .then(db => {
//     db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
//       console.log('Todos');
//       console.log(result);
//     }, err => console.log('Unable to delete todos', err));
//   })
//   .catch(consoleErrorMongo)
//   .then(() => clientDB.close());

let clientDB = {};
MongoClient.connect('mongodb://localhost:27017/TodoApp')
  .then((client) => {
    clientDB = client;
    return client.db('TodoApp');
  })
  .then(db => {
    return db.collection('Users').deleteMany({name: 'Alberto Eyo'})
      .then((result) => {
        console.log('Users');
        console.log(result);
        return result;
      }, err => console.log('Unable to delete todos', err))
      .then(() => {
        return db.collection('Users').findOneAndDelete({_id: 123}).then(result => console.log('Deleted', result));
      });
  })
  .catch(consoleErrorMongo)
  .then(() => clientDB.close());

