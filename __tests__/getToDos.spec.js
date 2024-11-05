const { connect, disconnect } = require('../utils/db');
const request = require('supertest');
const app = require('../app.js');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

let token;
let todoId;

beforeAll(async () => {
  await connect();

  let user = await User.findOne({
    email: 'mo@testing.com',
  });

  token = jwt.sign(
    {
      email: user.email,
      name: user.name,
      _id: user._id,
    },
    process.env.APP_KEY
  );
});

afterAll(async () => {
  await disconnect();
});

describe('Get All Todos', () => {
  it('Should return an array of Todos', async () => {
    const res = await request(app).get('/api/todos');
    todoId = res.body[1]._id;

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});

describe('Get Single Todo', () => {
  it('Should retrieve single todo', async () => {
    const res = await request(app)
      .get(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.text).toEqual('Buy new keyboard');
  });
});

describe('Create and retrieve a ToDo', () => {
  let newToDoId;
  it('Create Todo', async () => {
    const todo = { text: 'Test todo' };

    const res = await request(app)
      .post(`/api/todos`)
      .send(todo)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(201);
    newToDoId = res.body._id;
  });

  it('Should retrieve a new toDo', async () => {
    const res = await request(app).get(`/api/todos/${newToDoId}`).set(
      'Authorization',
      `Bearer ${token}`
    );

    expect(res.status).toBe(200)
    expect(res.body.text).toEqual("Test todo")
  });
});
