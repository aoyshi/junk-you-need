import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { ItemCreatedEvent } from './item-created-event';
import { Subjects } from './subjects';

export class ItemCreatedListener extends Listener<ItemCreatedEvent> {
  readonly subject = Subjects.ItemCreated;
  queueGroupName = 'payment-service';
  onMessage = (data: ItemCreatedEvent['data'], msg: Message) => {
    console.log('Event received!');
    console.log('Event id:', data.id);
    console.log('Event title:', data.title);
    console.log('Event price:', data.price);

    msg.ack();
  };
}
