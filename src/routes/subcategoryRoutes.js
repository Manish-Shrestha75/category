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

const router = express.Router();

router.get('/', getAllSubcategories);
router.get('/category/:categoryId', getSubcategoriesByCategory);
router.get('/:id', getSubcategoryById);
router.post('/', validateSubcategory, createSubcategory);
router.put('/:id', validateSubcategory, updateSubcategory);
router.delete('/:id', deleteSubcategory);

export default router;