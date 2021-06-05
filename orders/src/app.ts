import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@junkyouneed/common';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';

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

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
