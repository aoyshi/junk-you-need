import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('item', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('item:created', data, () => {
    console.log('Event published');
  });
});
