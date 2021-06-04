import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post(`/api/items/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'item',
      price: 1,
    })
    .expect(404);
});

it('returns 401 if user not signed in', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).post(`/api/items/${id}`).send().expect(401);
});

it('returns 401 if user does not own item', async () => {
  const response = await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title: 'item',
      price: 1,
    })
    .expect(201);

  await request(app)
    .post(`/api/items/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'item',
      price: 1,
    })
    .expect(401);
});

it('return 400 if invalid title or price provided', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/items')
    .set('Cookie', cookie)
    .send({
      title: 'item',
      price: 1,
    })
    .expect(201);

  await request(app)
    .post(`/api/items/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'item',
    })
    .expect(400);

  await request(app)
    .post(`/api/items/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 1,
    })
    .expect(400);

  await request(app)
    .post(`/api/items/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 1,
    })
    .expect(400);

  await request(app)
    .post('/api/items')
    .set('Cookie', cookie)
    .send({
      title: 'item',
      price: -1,
    })
    .expect(400);
});

it('updates item if valid title and price provided', async () => {
  const cookie = global.signin();

  const saveResponse = await request(app)
    .post('/api/items')
    .set('Cookie', cookie)
    .send({
      title: 'item',
      price: 1,
    })
    .expect(201);

  await request(app)
    .post(`/api/items/${saveResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'item edited',
      price: 2,
    })
    .expect(200);

  const itemResponse = await request(app)
    .get(`/api/items/${saveResponse.body.id}`)
    .send()
    .expect(200);

  expect(itemResponse.body.title).toEqual('item edited');
  expect(itemResponse.body.price).toEqual(2);
});

it('publishes event after updating item', async () => {
  const cookie = global.signin();

  const saveResponse = await request(app)
    .post('/api/items')
    .set('Cookie', cookie)
    .send({
      title: 'item',
      price: 1,
    })
    .expect(201);

  await request(app)
    .post(`/api/items/${saveResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'item edited',
      price: 2,
    })
    .expect(200);

  const itemResponse = await request(app)
    .get(`/api/items/${saveResponse.body.id}`)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
