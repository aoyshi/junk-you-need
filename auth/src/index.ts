import express from 'express';

const PORT = 3000;
const app = express();
app.use(express.json());

app.get('/api/users/currentuser', (req, res) => {
  res.status(200).send('I WORK!');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
