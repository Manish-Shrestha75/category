// Category validation
export const validateCategory = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ 
      error: 'Category name is required' 
    });
  }

  if (name.length < 2 || name.length > 255) {
    return res.status(400).json({ 
      error: 'Category name must be between 2 and 255 characters' 
    });
  }

  next();
};

// Subcategory validation
export const validateSubcategory = (req, res, next) => {
  const { name, categoryId } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ 
      error: 'Subcategory name is required' 
    });
  }

  if (!categoryId) {
    return res.status(400).json({ 
      error: 'Category ID is required' 
    });
  }

  if (name.length < 2 || name.length > 255) {
    return res.status(400).json({ 
      error: 'Subcategory name must be between 2 and 255 characters' 
    });
  }

  next();
};

// Product validation
export const validateProduct = (req, res, next) => {
  const { name, price, subcategoryId } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ 
      error: 'Product name is required' 
    });
  }

  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    return res.status(400).json({ 
      error: 'Valid price is required and must be greater than 0' 
    });
  }

  if (!subcategoryId) {
    return res.status(400).json({ 
      error: 'Subcategory ID is required' 
    });
  }

  if (name.length < 2 || name.length > 255) {
    return res.status(400).json({ 
      error: 'Product name must be between 2 and 255 characters' 
    });
  }

  next();
};