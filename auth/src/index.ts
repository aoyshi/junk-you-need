import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';

import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';

const PORT = 3000;
const app = express();
app.set('trust proxy', true); // trust ingress-nginx proxying traffic to express
app.use(express.json());
app.use(
  cookieSession({
    signed: false, // do not encrypt contents
    secure: true, // only use cookies if user using https
  })
);

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined in ENV.');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error(err);
  }
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

start();
