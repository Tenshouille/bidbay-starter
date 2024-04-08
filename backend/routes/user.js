import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json(user); // Sending user info back as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
})

router.get('/api/users/:userId/products', async (req, res) => {
  try {
    const sellerId = req.params.userId;
    const products = await Product.findAll({ where: { sellerId } });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Aucun produit trouvé pour cet utilisateur' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur server' });
  }
})

export default router
