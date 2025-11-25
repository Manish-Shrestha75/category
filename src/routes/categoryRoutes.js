import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { validateCategory } from '../middleware/validation.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.get('/',auth, getAllCategories);
router.get('/:id',auth, getCategoryById);


router.post('/', auth, validateCategory, createCategory);
router.put('/:id', auth, validateCategory, updateCategory);
router.delete('/:id', auth, deleteCategory);

export default router;