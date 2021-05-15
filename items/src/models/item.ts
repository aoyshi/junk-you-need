import mongoose from 'mongoose';

// describes attributes to create new Item (only props added by dev, not by mongoose)
interface ItemAttrs {
  title: string;
  price: number;
  userId: string;
}

// describes Item Model: added custom method "build"
interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttrs): ItemDoc;
}

// describes Item Document
// if mongoose added extra props BTS (createdAt, updatedAt), list them here
interface ItemDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    // override formats done by JSON.stringify when returning item in response
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// New "build" function wraps new Item creation
// ensures TS can typecheck attrs before creation
itemSchema.statics.build = (attrs: ItemAttrs) => {
  return new Item(attrs);
};

const Item = mongoose.model<ItemDoc, ItemModel>('Item', itemSchema);

export { Item };
