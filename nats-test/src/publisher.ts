import nats from 'node-nats-streaming';
import { ItemCreatedPublisher } from './events/item-created-publisher';

console.clear();

const stan = nats.connect('item', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const data = {
    id: '123',
    title: 'concert',
    price: 20,
  };

  const publisher = new ItemCreatedPublisher(stan);

  await publisher.publish(data);
});
