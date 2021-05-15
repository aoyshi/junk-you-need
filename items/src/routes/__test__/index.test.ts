import request from 'supertest';
import { app } from '../../app';

const createItem = () => {
  return request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({ title: 'item', price: 1 })
    .expect(201);
};

it('returns a list of items', async () => {
  await createItem();
  await createItem();

  const response = await request(app).get('/api/items').send().expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].title).toEqual('item');
  expect(response.body[1].title).toEqual('item');
});
