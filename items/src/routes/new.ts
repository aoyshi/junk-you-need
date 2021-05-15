import { currentUser, requireAuth, validateRequest } from '@junkyouneed/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Item } from '../models/item';

const router = express.Router();

router.post(
  '/api/items',
  requireAuth,
  currentUser,
  [
    body('title').trim().notEmpty().withMessage('Item must be present'),
    body('price')
      .trim()
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const item = Item.build({ title, price, userId: req.currentUser!.id });
    await item.save();
    res.status(201).send(item);
  }
);

export { router as createItemRouter };
