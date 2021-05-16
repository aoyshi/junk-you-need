import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { app } from '../app';

let mongo: any;
// Set up instance of mongodb in memory before tests run, and hook up mongoose to it
beforeAll(async () => {
  process.env.JWT_KEY = 'somesecretkey';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Refresh in-memory DB between tests
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// After all tests finished running, stop in-memory db and disconnect mongoose from it
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

global.signin = () => {
  // build a JWT payload: { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  // create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object: { jwt: MY_JWT }
  const session = { jwt: token };
  // turn session into JSON
  const sessionJSON = JSON.stringify(session);
  // encode JSON to base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with encoded data: "{express:sess= ENCODED_JSON}"
  return [`express:sess=${base64}`];
};
