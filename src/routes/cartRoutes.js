import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/:id', auth, updateCartItem);
router.delete('/:id', auth, removeFromCart);
router.delete('/', auth, clearCart);

export default router;