import mongoose from 'mongoose';

import { Password } from '../services/password';

// describes attributes to create new User (only props added by dev, not by mongoose)
interface UserAttrs {
  email: string;
  password: string;
}

// describes User Model: added custom method "build"
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// describes User Document
// if mongoose added extra props BTS (createdAt, updatedAt), list them here
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // override formats done by JSON.stringify when returning user in response
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// New "build" function wraps new User creation
// ensures TS can typecheck attrs before creation
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Hash password before saving to DB
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  done();
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
