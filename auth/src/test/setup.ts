import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;

// Set up instance of mongodb in memory before tests run, and hook up mongoose to it
beforeAll(async() => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Refresh in-memory DB between tests
beforeEach(async() => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// After all tests finished running, stop in-memory db and disconnect mongoose from it
afterAll(async() => {
  await mongo.stop();
  await mongoose.connection.close();
};