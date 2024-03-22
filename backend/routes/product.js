import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/api/products', getAllProducts);
router.get('/api/products/:productId', getProductById);
router.post('/api/products', authMiddleware, createProduct);
router.put('/api/products/:productId', authMiddleware, updateProduct);
router.delete('/api/products/:productId', authMiddleware, deleteProduct);

export default router;
