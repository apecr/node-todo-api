const {MongoClient, ObjectID} = require('mongodb');

const concatError = (error) => `Unable to connect to MongoDB server: ${error}`;
const consoleErrorMongo = (error, db) => console.log(concatError(error));

const insertOne = (db, table, data) => {
  return new Promise((resolve, reject) => {
    db.collection(table).insertOne(data, (error, result) => {
      if (error) {
        return reject(error);
      }
      console.log(result.ops[0]._id.getTimestamp());
      return resolve(result);
    });
  });
};

const find = (db, table, query) => {
  return new Promise((resolve, reject) => {
    db.collection(table).find(query, (error, result) => {
      if (error) {
        return reject(error);
      }
      console.log(result.ops[0]._id.getTimestamp());
      return resolve(result);
    });
  });
};
let clientDB = {};
MongoClient.connect('mongodb://localhost:27017/TodoApp')
  .then((client) => {
    clientDB = client;
    return client.db('TodoApp');
  })
  .then(db => {
    db.collection('Users').find({name: 'Alberto Eyo'}).toArray().then((docs) => {
      console.log('Users');
      console.log(JSON.stringify(docs, undefined, 2));
    }, err => console.log('Unable to fetch todos', err));
  })
  .catch(consoleErrorMongo)
  .then(() => clientDB.close());