const {MongoClient, ObjectID} = require('mongodb');

const concatError = (error) => `Unable to connect to MongoDB server: ${error}`;
const consoleErrorMongo = (error, db) => console.log(concatError(error));

let clientDB = {};
MongoClient.connect('mongodb://localhost:27017/TodoApp')
  .then((client) => {
    clientDB = client;
    return client.db('TodoApp');
  })
  .then(db => {
    return db.collection('Users').findOneAndUpdate(
      {
        _id: new ObjectID('5a8acacaadf6fd0a92167746')
      },
      {
        $set: {
          name: 'Alberto Eyo'
        },
        $inc: {
          age: 1
        }
      },
      {
        returnOriginal: false
      });
  })
  .then(console.log)
  .catch(consoleErrorMongo)
  .then(() => clientDB.close());