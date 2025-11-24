import { getRepository } from 'typeorm';

// Get all products with subcategory
export const getAllProducts = async (req, res) => {
  try {
    const productRepository = getRepository('Product');
    const products = await productRepository.find({
      relations: ['subcategory']
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by subcategory ID
export const getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const productRepository = getRepository('Product');
    const products = await productRepository.find({
      where: { subcategory: { id: subcategoryId } },
      relations: ['subcategory']
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productRepository = getRepository('Product');
    const product = await productRepository.findOne({
      where: { id },
      relations: ['subcategory']
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, subcategoryId } = req.body;
    
    if (!name || !price || !subcategoryId) {
      return res.status(400).json({ error: 'Name, price and subcategoryId are required' });
    }
    
    const productRepository = getRepository('Product');
    const subcategoryRepository = getRepository('Subcategory');
    
   
    const subcategory = await subcategoryRepository.findOne({ where: { id: subcategoryId } });
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    
    const product = productRepository.create({
      name,
      description,
      price: parseFloat(price),
      subcategory
    });
    
    const result = await productRepository.save(product);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, subcategoryId } = req.body;
    
    const productRepository = getRepository('Product');
    const subcategoryRepository = getRepository('Subcategory');
    
    const product = await productRepository.findOne({
      where: { id },
      relations: ['subcategory']
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
   
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    
    // Update subcategory if provided
    if (subcategoryId) {
      const subcategory = await subcategoryRepository.findOne({ where: { id: subcategoryId } });
      if (!subcategory) {
        return res.status(404).json({ error: 'Subcategory not found' });
      }
      product.subcategory = subcategory;
    }
    
    const result = await productRepository.save(product);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productRepository = getRepository('Product');
    const product = await productRepository.findOne({ where: { id } });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await productRepository.remove(product);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};