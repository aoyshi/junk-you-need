import { Publisher, ItemUpdatedEvent, Subjects } from '@junkyouneed/common';

export class ItemUpdatedPublisher extends Publisher<ItemUpdatedEvent> {
  readonly subject = Subjects.ItemUpdated;
}
