const expect = require('expect');
const request = require('supertest');
const chaiExpect = require('chai').expect;

const { app } = require('./../../server/server');
const { Todo } = require('./../../server/models/todo');
const { User } = require('./../../server/models/user');
const { ObjectID } = require('mongodb');
const { testTodos, populateTodos, testUsers, populateUsers } = require('./seed/seed');

/* global define, it, describe, before, beforeEach, afterEach, after */

const getIdJustCreated = () => {
  return Promise.resolve(testTodos[0]._id.toHexString());
};

describe('Testing Todo App', () => {
  beforeEach('Setup the database', populateTodos);
  describe('#POST /todos', () => {
    it('should create a new todo', () => {
      const text = 'Test todo task';
      return request(app)
        .post('/todos')
        .send({ text })
        .expect(201)
        .expect((res) => expect(res.body.text).toBe(text))
        .then((res) => {
          return Todo.find({ text }).then((todos) => {
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

describe('Testing the user sections of todoApp', () => {
  beforeEach('Populate users', populateUsers);
  describe('GET /users/me', () => {
    it('should return user if authenticated', () => {
      return request(app)
        .get('/users/me')
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200)
        .then((res) => {
          expect(res.body._id).toBe(testUsers[0]._id.toHexString());
          expect(res.body.email).toBe(testUsers[0].email);
        });
    });
    it('should return a 401 if not authenticated', () => {
      return request(app)
        .get('/users/me')
        .expect(401)
        .then((res) => {
          expect(res.body).toEqual({});
        });
    });
  });
  describe('POST /users', () => {
    const user = { email: 'test@example.com', password: '123mbn!' };
    it('Should create a user', () => {
      return request(app)
        .post('/users')
        .send(user)
        .expect(201)
        .then(res => {
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body._id).toBeTruthy();
          expect(res.body.email).toBe(user.email);
        })
        .then(() => User.findOne({ email: user.email }))
        .then(userDB => expect(userDB.password).not.toBe(user.password));
    });
    it('Should return validation errors if request is invalid', () => {
      return request(app)
        .post('/users')
        .send({ email: 'asasas', password: '123' })
        .expect(400)
        .then(res => {
          expect(res.headers['x-auth']).not.toBeTruthy();
          expect(res.body._message).toBe('Users validation failed');
          expect(res.body.message).toBe('Users validation failed: email: asasas is not a valid email!, password: Path `password` (`123`) is shorter than the minimum allowed length (6).');
        })
        .then(() => User.findOne({ email: 'asasas' }))
        .then(userDB => expect(userDB).not.toBeTruthy());
    });
    it('Should not create user if email is in use', () => {
      return request(app)
        .post('/users')
        .send({ email: testUsers[0].email, password: '123456' })
        .expect(400)
        .then(res => {
          expect(res.headers['x-auth']).not.toBeTruthy();
        });
    });
  });
  describe('POST /users/login', () => {
    it('should login user and return auth token', () => {
      return request(app)
        .post('/users/login')
        .send({email: testUsers[1].email, password: testUsers[1].password})
        .expect(201)
        .then(res => Promise.resolve(expect(res.headers['x-auth']).toBeTruthy())
          .then(() => User.findById(testUsers[1]._id))
          .then(user => chaiExpect(user.tokens[0].token).to.be.equal(res.headers['x-auth'])));
    });
    it('should reject invalid login', () => {
      return request(app)
        .post('/users/login')
        .send({email: testUsers[1].email, password: 'wrongPassword'})
        .expect(400)
        .then(res => Promise.resolve(chaiExpect(res.headers['x-auth']).to.be.undefined)
          .then(() => User.findById(testUsers[1]._id))
          .then(user => chaiExpect(user.tokens).to.be.an('array').that.is.empty));
    });
  });
});


