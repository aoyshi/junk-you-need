import request from 'supertest';
import { app } from '../../app';

it('sets cookie in response after successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '1234',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns 400 for email that does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '1234',
    })
    .expect(400);
});

it('returns 400 for incorrect password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'wrong password',
    })
    .expect(400);
});
