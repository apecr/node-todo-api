const MongoClient = require('mongodb').MongoClient;
const pctp = require('pisco-callback-to-promise');

const concatError = (error) => `Unable to connect to MongoDB server: ${error}`;
const consoleErrorMongo = (error, db) => console.log(concatError(error));

const insertOne = (db, table, data) => {
  return new Promise((resolve, reject) => {
    db.collection(table).insertOne(data, (error, result) => {
      if (error) {
        return reject(error);
      }
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
  .then((db) => insertOne(db, 'Users', {name: 'Alberto Eyo', age: 32, location: 'Madrid'}))
  .then(result => console.log(JSON.stringify(result.ops, undefined, 2)))
  .then(() => clientDB.close())
  .catch(consoleErrorMongo);