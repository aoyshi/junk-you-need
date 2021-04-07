import express from 'express';

const router = express.Router();

router.post('/api/users/signup', (req, res) => {
  res.status(200).send('SIGN UP!');
});

export { router as signUpRouter };
