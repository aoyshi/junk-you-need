import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  res.status(200).send('SIGN Out!');
});

export { router as signOutRouter };
