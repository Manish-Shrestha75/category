import express from 'express';
import {
  getAllProducts,
  getProductsBySubcategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { validateProduct } from '../middleware/validation.js';
import { auth } from '../middleware/auth.js';
import { uploadProductImage } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', auth, getAllProducts);
router.get('/subcategory/:subcategoryId',auth, getProductsBySubcategory);
router.get('/:id',auth, getProductById);

router.post('/', auth, uploadProductImage, validateProduct, createProduct);
router.put('/:id', auth, uploadProductImage, validateProduct, updateProduct);
router.delete('/:id', auth, deleteProduct);

export default router;