const { Subcategories, Category } = require("../../db");

const createSubcategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Name and categoryId are required' });
    }

    // Check if the category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const subcategory = await Subcategories.create({ name, categoryId });
    return res.status(201).json(subcategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategories.findAll({
      include: [Category] // Optional: Include the Category details
    });
    res.status(200).json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving subcategories" });
  }
};

const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategories.findByPk(id, {
      include: [Category] // Optional: Include the Category details
    });

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving subcategory" });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    const subcategory = await Subcategories.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Optionally validate the category
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      subcategory.categoryId = categoryId;
    }

    subcategory.name = name;
    await subcategory.save();

    res.status(200).json({ message: "Subcategory updated", subcategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating Subcategory" });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategories.findByPk(id);

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    await subcategory.destroy();
    res.status(200).json({ message: "Subcategory deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting Subcategory" });
  }
};

module.exports = {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};
