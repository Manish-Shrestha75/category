import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart
} from '../controllers/wishlistController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.get('/', auth, getWishlist);
router.post('/add', auth, addToWishlist);
router.delete('/:id', auth, removeFromWishlist);
router.delete('/', auth, clearWishlist);
router.post('/:id/move-to-cart', auth, moveToCart);

export default router;