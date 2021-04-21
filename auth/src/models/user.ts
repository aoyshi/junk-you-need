import mongoose from 'mongoose';

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

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// New "build" function wraps new User creation
// ensures TS can typecheck attrs before creation
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };