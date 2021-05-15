import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns 404 if item not found', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/items/${id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404);
});

it('returns item if found', async () => {
  const item = { title: 'item', price: 1 };

  const saveResponse = await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send(item)
    .expect(201);
  const showResponse = await request(app)
    .get(`/api/items/${saveResponse.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200);

  expect(showResponse.body.title).toEqual(item.title);
  expect(showResponse.body.price).toEqual(item.price);
});
