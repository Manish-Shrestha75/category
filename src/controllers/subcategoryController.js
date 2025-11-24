import { getRepository } from 'typeorm';


export const getAllSubcategories = async (req, res) => {
  try {
    const subcategoryRepository = getRepository('Subcategory');
    const subcategories = await subcategoryRepository.find({
      relations: ['category', 'products']
    });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategoryRepository = getRepository('Subcategory');
    const subcategories = await subcategoryRepository.find({
      where: { category: { id: categoryId } },
      relations: ['products']
    });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategoryRepository = getRepository('Subcategory');
    const subcategory = await subcategoryRepository.findOne({
      where: { id },
      relations: ['category', 'products']
    });
    
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const createSubcategory = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;
    
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Name and categoryId are required' });
    }
    
    const subcategoryRepository = getRepository('Subcategory');
    const categoryRepository = getRepository('Category');
    
 
    const category = await categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const subcategory = subcategoryRepository.create({
      name,
      description,
      category
    });
    
    const result = await subcategoryRepository.save(subcategory);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId } = req.body;
    
    const subcategoryRepository = getRepository('Subcategory');
    const categoryRepository = getRepository('Category');
    
    const subcategory = await subcategoryRepository.findOne({
      where: { id },
      relations: ['category']
    });
    
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    
   
    if (name) subcategory.name = name;
    if (description) subcategory.description = description;
    
    
    if (categoryId) {
      const category = await categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      subcategory.category = category;
    }
    
    const result = await subcategoryRepository.save(subcategory);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategoryRepository = getRepository('Subcategory');
    const subcategory = await subcategoryRepository.findOne({ where: { id } });
    
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    
    await subcategoryRepository.remove(subcategory);
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};