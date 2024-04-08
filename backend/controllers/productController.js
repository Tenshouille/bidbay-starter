import { Product, User, Bid } from '../orm/index.js';

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.findAll({
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username'], 
        },
        {
          model: Bid,
          as: 'bids', 
          include: [{
            model: User,
            as: 'bidder',
            attributes: ['id', 'username'], 
          }]
        }
      ]
    });

    const productsWithSellerName = products.map(product => {
      const productPlain = product.get({ plain: true });
      return {
        ...productPlain,
        sellerName: productPlain.seller ? productPlain.seller.username : undefined,
      };
    });

    res.status(200).json(productsWithSellerName);
  } catch (error) {
    console.error('Failed to get all products with seller names:', error);
    res.status(500).send('Internal Server Error');
  }
};



const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Bid,
          as: 'bids',
          include: [{
            model: User,
            as: 'bidder',
            attributes: ['id','username'], 
          }],
        },
        {
          model: User,
          as: 'seller', 
          attributes: ['id','username'], 
        }
      ],
    });

    if (!product) {
      return res.status(404).send('Product not found');
    }

    const productResponse = {
      ...product.get({ plain: true }),
      sellerName: product.seller ? product.seller.username : undefined, 
    };

    res.status(200).json(productResponse);
  } catch (error) {
    console.error('Failed to get product by ID:', error);
    res.status(500).send('Internal Server Error');
  }
};


const createProduct = async (req, res) => {
  try {
    const { name, description, category, originalPrice, pictureUrl, endDate } = req.body;

    let missingFields = [];

    if (!name) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (!category) missingFields.push("category");
    if (originalPrice === undefined) missingFields.push("originalPrice");
    if (!pictureUrl) missingFields.push("pictureUrl");
    if (!endDate) missingFields.push("endDate");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Invalid or missing fields",
        details: `Missing fields: ${missingFields.join(", ")}`,
      });
    }

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
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
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
      res.status(204).send();
    } catch (error) {
      console.error('Failed to delete product:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  
  export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
  