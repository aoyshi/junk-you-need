import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';

jest.mock('../../nats-wrapper');

it('has a route handler listening to /api/items for POST requests', async () => {
  const response = await request(app).post('/api/items').send();
  expect(response.status).not.toEqual(404);
});

it('disallows access if user not signed in', async () => {
  await request(app).post('/api/items').send().expect(401);
});

it('allows access if user is signed in', async () => {
  const response = await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send();
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: '10',
    })
    .expect(400);

  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      price: '10',
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title: 'item',
      price: '',
    })
    .expect(400);

  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title: 'item',
    })
    .expect(400);

  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title: 'item',
      price: -1,
    })
    .expect(400);
});

it('creates a new item if valid attributes provided', async () => {
  let items = await Item.find({});
  expect(items.length).toEqual(0);

  const title = 'item';
  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 1,
    })
    .expect(201);

  items = await Item.find({});
  expect(items.length).toEqual(1);
  expect(items[0].price).toEqual(1);
  expect(items[0].title).toEqual(title);
});
