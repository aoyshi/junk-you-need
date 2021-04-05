import express from 'express';

import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';

const PORT = 3000;
const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
