import express from 'express';
import {
  getAllSubcategories,
  getSubcategoriesByCategory,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../controllers/subcategoryController.js';
import { validateSubcategory } from '../middleware/validation.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.get('/',auth, getAllSubcategories);
router.get('/category/:categoryId', auth, getSubcategoriesByCategory);
router.get('/:id',auth, getSubcategoryById);
router.post('/', auth, validateSubcategory, createSubcategory);
router.put('/:id', auth, validateSubcategory, updateSubcategory);
router.delete('/:id', auth, deleteSubcategory);

export default router;