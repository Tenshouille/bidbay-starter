import express from 'express';
import { Bid, Product, User } from '../orm/index.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/api/products/:productId/bids', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { price } = req.body;
    const bidderId = req.user.id;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    const bid = await Bid.create({
      productId,
      bidderId,
      price,
      date: new Date(),
    });

    res.status(201).json(bid);
  } catch (error) {
    console.error('Error creating bid:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/api/bids/:bidId', authMiddleware, async (req, res) => {
  try {
    const { bidId } = req.params;
    const bid = await Bid.findByPk(bidId);

    if (!bid) {
      return res.status(404).send('Bid not found');
    }

    if (bid.bidderId !== req.user.id) {
      return res.status(403).send('Unauthorized');
    }

    await bid.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting bid:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;