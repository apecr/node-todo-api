const expect = require('expect');
const request = require('supertest');

const {app} = require('./../../server/server');
const {Todo} = require('./../../server/models/todo');

/* global define, it, describe, before, beforeEach, afterEach, after */
const testTodos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
}];

describe('Testing Todo App', () => {
  beforeEach('Setup the database', () => Todo.remove({}).then(() => Todo.insertMany(testTodos)));
  describe('#POST /todos', () => {
    it('should create a new todo', () => {
      const text = 'Test todo task';
      return request(app)
        .post('/todos')
        .send({text})
        .expect(201)
        .expect((res) => expect(res.body.text).toBe(text))
        .then((res) => {
          return Todo.find({text}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
          });
        });
    });
    it('Should not create a todo invalidate body data', () => {
      return request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .then(() => {
          return Todo
            .find()
            .then(todos => expect(todos.length).toBe(2));
        });
    });
  });
  describe('#GET /todos', () => {
    it('Should get all todos', () => {
      return request(app)
        .get('/todos')
        .expect(200)
        .expect(res => expect(res.body.todos.length).toBe(2));
    });
  });
});


