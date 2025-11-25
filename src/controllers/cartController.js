import { getRepository } from 'typeorm';

export const getCart = async (req, res) => {
  try {
    const cartRepository = getRepository('Cart');
    const cartItems = await cartRepository.find({
      where: { user: { id: req.user.id } },
      relations: ['product', 'product.subcategory']
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      cartItems,
      total: parseFloat(total.toFixed(2)),
      itemCount: cartItems.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const cartRepository = getRepository('Cart');
    const productRepository = getRepository('Product');

    const product = await productRepository.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingCartItem = await cartRepository.findOne({
      where: {
        user: { id: req.user.id },
        product: { id: productId }
      }
    });

    let cartItem;

    if (existingCartItem) {
      
      existingCartItem.quantity += parseInt(quantity);
      cartItem = await cartRepository.save(existingCartItem);
    } else {
     
      const newCartItem = cartRepository.create({
        user: req.user,
        product: product,
        quantity: parseInt(quantity)
      });
      cartItem = await cartRepository.save(newCartItem);
    }

    const updatedCartItem = await cartRepository.findOne({
      where: { id: cartItem.id },
      relations: ['product', 'product.subcategory']
    });

    res.status(201).json({
      message: 'Product added to cart successfully',
      cartItem: updatedCartItem
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required (min: 1)' });
    }

    const cartRepository = getRepository('Cart');
    const cartItem = await cartRepository.findOne({
      where: { id: parseInt(id), user: { id: req.user.id } },
      relations: ['product']
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity = parseInt(quantity);
    const updatedCartItem = await cartRepository.save(cartItem);

    res.json({
      message: 'Cart item updated successfully',
      cartItem: updatedCartItem
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartRepository = getRepository('Cart');
    const cartItem = await cartRepository.findOne({
      where: { id: parseInt(id), user: { id: req.user.id } }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartRepository.remove(cartItem);

    res.json({
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const clearCart = async (req, res) => {
  try {
    const cartRepository = getRepository('Cart');
    const cartItems = await cartRepository.find({
      where: { user: { id: req.user.id } }
    });

    await cartRepository.remove(cartItems);

    res.json({
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};