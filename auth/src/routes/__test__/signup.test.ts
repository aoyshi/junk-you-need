import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234',
    })
    .expect(201);
});

it('returns a 400 for invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: '1234',
    })
    .expect(400);
});

it('returns a 400 for invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1',
    })
    .expect(400);
});

it('returns a 400 for missing credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      password: '1234',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234',
    })
    .expect(400);
});

it('sets cookie in response after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
