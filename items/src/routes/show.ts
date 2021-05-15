import express, { Request, Response } from 'express';
import { currentUser, NotFoundError, requireAuth } from '@junkyouneed/common';
import { Item } from '../models/item';

const router = express.Router();

router.get(
  '/api/items/:id',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const item = await Item.findById(req.params.id);
    if (!item) {
      throw new NotFoundError();
    }
    res.status(200).send(item);
  }
);

export { router as showItemRouter };
