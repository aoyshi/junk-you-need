import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('You must enter a valid email address'),
    body('password')
      .isLength({ min: 4, max: 12 })
      .withMessage('Password must be between 4 and 12 characters long!'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    res.status(200).send('YOU SHALL NOW PASS!');
  }
);

export { router as signInRouter };
