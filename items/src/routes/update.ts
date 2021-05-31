import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@junkyouneed/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Item } from '../models/item';

import { natsWrapper } from '../nats-wrapper';
import { ItemUpdatedPublisher } from '../events/publishers/item-updated-publisher';

const router = express.Router();

router.post(
  '/api/items/:id',
  requireAuth,
  currentUser,
  [
    body('title').trim().notEmpty().withMessage('Title must be present'),
    body('price')
      .trim()
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const item = await Item.findById(req.params.id);
    if (!item) {
      throw new NotFoundError();
    }
    if (item.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;
    item.set({ title, price });
    await item.save();

    await new ItemUpdatedPublisher(natsWrapper.client).publish({
      id: item.id,
      title: item.title,
      price: item.price,
      userId: item.userId,
    });

    res.status(200).send(item);
  }
);

export { router as updateItemRouter };
