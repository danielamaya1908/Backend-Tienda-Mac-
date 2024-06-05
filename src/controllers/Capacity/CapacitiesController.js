const { Capacities, Category } = require("../../db");

const createCapacity = async (req, res) => {
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

    const capacity = await Capacities.create({ name, categoryId });
    const capacityWithCategory = await Capacities.findByPk(capacity.id, {
      include: [Category]
    });
    return res.status(201).json(capacityWithCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllCapacities = async (req, res) => {
  try {
    const capacities = await Capacities.findAll({
      include: [Category]
    });
    res.status(200).json(capacities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving capacities" });
  }
};

const getCapacityById = async (req, res) => {
  try {
    const { id } = req.params;
    const capacity = await Capacities.findByPk(id, {
      include: [Category]
    });

    if (!capacity) {
      return res.status(404).json({ message: "Capacity not found" });
    }

    res.status(200).json(capacity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving capacity" });
  }
};

const updateCapacity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    const capacity = await Capacities.findByPk(id);
    if (!capacity) {
      return res.status(404).json({ message: "Capacity not found" });
    }

    // Optionally validate the category
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      capacity.categoryId = categoryId;
    }

    capacity.name = name;
    await capacity.save();

    const updatedCapacity = await Capacities.findByPk(capacity.id, {
      include: [Category]
    });

    res.status(200).json(updatedCapacity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating capacity" });
  }
};

const deleteCapacity = async (req, res) => {
  try {
    const { id } = req.params;
    const capacity = await Capacities.findByPk(id);

    if (!capacity) {
      return res.status(404).json({ message: "Capacity not found" });
    }

    await capacity.destroy();
    res.status(200).json({ message: "Capacity deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting capacity" });
  }
};

module.exports = {
  createCapacity,
  getAllCapacities,
  getCapacityById,
  updateCapacity,
  deleteCapacity,
};