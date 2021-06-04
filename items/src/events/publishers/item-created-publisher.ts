import { Publisher, ItemCreatedEvent, Subjects } from '@junkyouneed/common';

export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent> {
  readonly subject = Subjects.ItemCreated;
}
