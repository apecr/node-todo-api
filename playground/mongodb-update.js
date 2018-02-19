const {MongoClient, ObjectID} = require('mongodb');

const concatError = (error) => `Unable to connect to MongoDB server: ${error}`;
const consoleErrorMongo = (error, db) => console.log(concatError(error));


// findOneAndUpdate

let clientDB = {};
MongoClient.connect('mongodb://localhost:27017/TodoApp')
  .then((client) => {
    clientDB = client;
    return client.db('TodoApp');
  })
  .then(db => {
    return db.collection('Todos').findOneAndUpdate(
      {
        _id: new ObjectID('5a8ae3e5ea2723e8a2009ea3')
      },
      {
        $set: {
          completed: true
        }
      },
      {
        returnOriginal: false
      });
  })
  .then(console.log)
  .catch(consoleErrorMongo)
  .then(() => clientDB.close());

