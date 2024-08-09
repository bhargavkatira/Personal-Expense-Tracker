const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported from server.js
const mongoose = require('mongoose');
const User = require('../models/user');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Routes', () => {
  let token;

  beforeEach(async () => {
    // Register a new user
    await request(app)
      .post('/api/users/register')
      .send({ username: 'testuser', password: 'testpassword' });
    // Login to get the token
    const response = await request(app)
      .post('/api/users/login')
      .send({ username: 'testuser', password: 'testpassword' });
    token = response.body.token;
  });

  test('Should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ username: 'newuser', password: 'newpassword' });
    expect(response.status).toBe(201);
    expect(response.text).toBe('User registered');
  });

  test('Should login and return a token', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  // Add more tests for other routes, e.g., expenses, categories, etc.
});