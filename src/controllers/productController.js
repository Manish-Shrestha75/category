import { getRepository } from 'typeorm';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

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

// Create new product with image
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

    const productData = {
      name,
      description,
      price: parseFloat(price),
      subcategory
    };

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        productData.image = uploadResult.secure_url;
        productData.image_public_id = uploadResult.public_id;
      } catch (uploadError) {
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    const product = productRepository.create(productData);
    const result = await productRepository.save(product);

    res.status(201).json({
      message: 'Product created successfully',
      product: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product with image
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

    // Update fields
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

    if (req.file) {
      try {
        
        if (product.image_public_id) {
          await deleteFromCloudinary(product.image_public_id);
        }

        const uploadResult = await uploadToCloudinary(req.file.buffer);
        product.image = uploadResult.secure_url;
        product.image_public_id = uploadResult.public_id;
      } catch (uploadError) {
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    const result = await productRepository.save(product);

    res.json({
      message: 'Product updated successfully',
      product: result
    });
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

    
    if (product.image_public_id) {
      await deleteFromCloudinary(product.image_public_id);
    }

    await productRepository.remove(product);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};