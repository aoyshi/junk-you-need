import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@junkyouneed/common';
import { createItemRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); // trust ingress-nginx proxying traffic to express
app.use(express.json());
app.use(
  cookieSession({
    signed: false, // do not encrypt contents
    secure: process.env.NODE_ENV !== 'test', // only use cookies if user using https in non-test env
  })
);
app.use(currentUser); //get logged in user (if any)

app.use(createItemRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
