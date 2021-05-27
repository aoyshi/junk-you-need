import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';

export class ItemCreatedListener extends Listener {
  subject = 'item:created';
  queueGroupName = 'payment-service';
  onMessage = (data: any, msg: Message) => {
    console.log('Event data:', data);

    msg.ack();
  };
}
