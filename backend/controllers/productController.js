// controllers/productsController.js
import { Product } from '../orm/index.js';

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};


const createProduct = async (req, res) => {
    try {
      const { name, description, category, originalPrice, pictureUrl, endDate } = req.body;
      const newProduct = await Product.create({
        name,
        description,
        category,
        originalPrice,
        pictureUrl,
        endDate,
        sellerId: req.user.id
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Failed to create product:', error);
      res.status(400).send('Bad Request');
    }
  };
  
  
  const updateProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      if (product.sellerId !== req.user.id) {
        return res.status(403).send('Forbidden - You are not the owner of this product');
      }
  
      const { name, description, category, originalPrice, pictureUrl, endDate } = req.body;
      const updatedProduct = await product.update({
        name,
        description,
        category,
        originalPrice,
        pictureUrl,
        endDate
      });
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Failed to update product:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  
  const deleteProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      if (product.sellerId !== req.user.id) {
        return res.status(403).send('Forbidden - You are not the owner of this product');
      }
  
      await product.destroy();
      res.status(204).send(); // No Content
    } catch (error) {
      console.error('Failed to delete product:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  
  export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
  