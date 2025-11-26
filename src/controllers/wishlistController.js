import { getRepository } from 'typeorm';


export const getWishlist = async (req, res) => {
  try {
    const wishlistRepository = getRepository('Wishlist');
    const wishlistItems = await wishlistRepository.find({
      where: { user: { id: req.user.id } },
      relations: ['product', 'product.subcategory']
    });

    res.json({
      wishlistItems,
      itemCount: wishlistItems.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const wishlistRepository = getRepository('Wishlist');
    const productRepository = getRepository('Product');

    
    const product = await productRepository.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingWishlistItem = await wishlistRepository.findOne({
      where: {
        user: { id: req.user.id },
        product: { id: productId }
      }
    });

    if (existingWishlistItem) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

  
    const wishlistItem = wishlistRepository.create({
      user: req.user,
      product: product
    });

    const result = await wishlistRepository.save(wishlistItem);

  
    const wishlistItemWithProduct = await wishlistRepository.findOne({
      where: { id: result.id },
      relations: ['product', 'product.subcategory']
    });

    res.status(201).json({
      message: 'Product added to wishlist successfully',
      wishlistItem: wishlistItemWithProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const wishlistRepository = getRepository('Wishlist');
    const wishlistItem = await wishlistRepository.findOne({
      where: { id: parseInt(id), user: { id: req.user.id } }
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    await wishlistRepository.remove(wishlistItem);

    res.json({
      message: 'Item removed from wishlist successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const wishlistRepository = getRepository('Wishlist');
    const wishlistItems = await wishlistRepository.find({
      where: { user: { id: req.user.id } }
    });

    await wishlistRepository.remove(wishlistItems);

    res.json({
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const moveToCart = async (req, res) => {
  try {
    const { id } = req.params;

    const wishlistRepository = getRepository('Wishlist');
    const cartRepository = getRepository('Cart');

    const wishlistItem = await wishlistRepository.findOne({
      where: { id: parseInt(id), user: { id: req.user.id } },
      relations: ['product']
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    
    const existingCartItem = await cartRepository.findOne({
      where: {
        user: { id: req.user.id },
        product: { id: wishlistItem.product.id }
      }
    });

    if (existingCartItem) {
      
      existingCartItem.quantity += 1;
      await cartRepository.save(existingCartItem);
    } else {
      
      const cartItem = cartRepository.create({
        user: req.user,
        product: wishlistItem.product,
        quantity: 1
      });
      await cartRepository.save(cartItem);
    }


    await wishlistRepository.remove(wishlistItem);

    res.json({
      message: 'Product moved to cart successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};