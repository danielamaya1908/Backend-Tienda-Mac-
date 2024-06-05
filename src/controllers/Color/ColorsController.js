const { Colors, Category } = require("../../db");

const createColor = async (req, res) => {
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

    const color = await Colors .create({ name, categoryId });
    return res.status(201).json(color);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllColors = async (req, res) => {
  try {
    const colors = await Colors.findAll({
      include: [Category], // Include the Category details
    });

    // Aquí puedes acceder al nombre de la categoría para cada color
    const colorsWithCategoryName = colors.map(color => {
      const categoryName = color.Category.name;
      return { ...color.toJSON(), categoryName };
    });

    res.status(200).json(colorsWithCategoryName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving colors" });
  }
};

const getColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Colors.findByPk(id, {
      include: [Category], // Include the Category details
    });

    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    // Aquí puedes acceder al nombre de la categoría para el color
    const categoryName = color.Category.name;

    res.status(200).json({ ...color.toJSON(), categoryName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving color" });
  }
};

const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    const color = await Colors.findByPk(id);
    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    // Optionally validate the category
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      color.categoryId = categoryId;
    }

    color.name = name;
    await color.save();

    res.status(200).json({ message: "Color updated", color });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating Color" });
  }
};

const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Colors.findByPk(id);

    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    await color.destroy();
    res.status(200).json({ message: "Color deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting Color" });
  }
};

module.exports = {
  createColor,
  getAllColors,
  getColorById,
  updateColor,
  deleteColor,
};