import { getRepository } from 'typeorm';

// Get all categories with subcategories
export const getAllCategories = async (req, res) => {
  try {
    const categoryRepository = getRepository('Category');
    const categories = await categoryRepository.find({
      relations: ['subcategories']
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryRepository = getRepository('Category');
    const category = await categoryRepository.findOne({
      where: { id },
      relations: ['subcategories']
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const categoryRepository = getRepository('Category');
    
    const existingCategory = await categoryRepository.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    
    const category = categoryRepository.create({
      name,
      description
    });
    
    const result = await categoryRepository.save(category);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const categoryRepository = getRepository('Category');
    const category = await categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Update fields
    if (name) category.name = name;
    if (description) category.description = description;
    
    const result = await categoryRepository.save(category);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryRepository = getRepository('Category');
    const category = await categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await categoryRepository.remove(category);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};