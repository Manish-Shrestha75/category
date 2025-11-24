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

const router = express.Router();

router.get('/', getAllProducts);
router.get('/subcategory/:subcategoryId', getProductsBySubcategory);
router.get('/:id', getProductById);
router.post('/', validateProduct, createProduct);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);

export default router;