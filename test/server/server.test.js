const expect = require('expect');
const request = require('supertest');

const {app} = require('./../../server/server');
const {Todo} = require('./../../server/models/todo');
const {ObjectID} = require('mongodb');

/* global define, it, describe, before, beforeEach, afterEach, after */
const testTodos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];
const getIdJustCreated = () => {
  return Promise.resolve(testTodos[0]._id.toHexString());
};

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
  describe('#GET /todos/:id', () => {
    it('Should get a todo by id rigth', () => {
      return getIdJustCreated()
        .then(id => {
          return request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect(res => expect(res.body.todo.text).toBe(testTodos[0].text));
        });
    });
    it('Should get an error because the is not valid', () => {
      return request(app)
        .get('/todos/2urefdhbsk')
        .expect(404);
    });
    it('Should get a 404, the id does not exist although is valid', () => {
      const incrementFirstNumber = id => Number(id.substr(null, 1)) + 1 + id.substr(1);
      return getIdJustCreated()
        .then(incrementFirstNumber)
        .then(id => {
          return request(app)
            .get(`/todos/${id}`)
            .expect(404);
        });
    });
  });
  describe('#DELETE /todos/:id', () => {
    it('Should delete a todo by id', () => {
      return getIdJustCreated()
        .then(id => request(app).delete(`/todos/${id}`).expect(200))
        .then(res => expect(res.body.todo.text).toBe(testTodos[0].text))
        .then(getIdJustCreated)
        .then(id => Todo.findById(id))
        .then(todo => expect(todo).toBe(null));
    });
    it('Should get a 404, the id does not exist', () => {
      return request(app)
        .delete(`/todos/${new ObjectID()}`)
        .expect(404)
        .then(res => expect(res.body).toEqual({}));
    });
    it('Should get a 404, the id is not valid', () => {
      return request(app)
        .delete('/todos/123')
        .expect(404)
        .then(res => expect(res.body).toEqual({}));
    });
  });
  describe('#PATCH /todos/:id', () => {
    it('Should update the completed and completedAt', () => {
      return request(app)
        .patch(`/todos/${testTodos[0]._id.toHexString()}`)
        .send({
          text: 'New todo text',
          completed: true
        })
        .expect(200)
        .then(res => expect(res.body.todo.text).toBe('New todo text'))
        .then(() => Todo.findById(testTodos[0]._id.toHexString()))
        .then(todo => {
          expect(todo.text).toBe('New todo text');
          expect(todo.completed).toBe(true);
          expect(todo.completedAt).toBeTruthy();
        });
    });
    it('Should clear completedAt when todo is not completed', () => {
      return request(app)
        .patch(`/todos/${testTodos[1]._id.toHexString()}`)
        .send({
          text: 'New todo text',
          completed: false
        })
        .expect(200)
        .then(res => expect(res.body.todo.text).toBe('New todo text'))
        .then(() => Todo.findById(testTodos[1]._id.toHexString()))
        .then(todo => {
          expect(todo.text).toBe('New todo text');
          expect(todo.completed).toBe(false);
          expect(todo.completedAt).toBe(null);
        });
    });

  });
});


