const { Capacities } = require("../../db");

const createCapacities = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const size = await Capacities.create({ name });

    return res.status(201).json(size);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllCapacitiess = async (req, res) => {
  try {
    const sizes = await Capacities.findAll();
    res.status(200).json(sizes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving sizes" });
  }
};

const getCapacitiesById = async (req, res) => {
  try {
    const { id } = req.params;
    const size = await Capacities.findByPk(id);

    if (!size) {
      return res.status(404).json({ message: "Capacities not found" });
    }

    res.status(200).json(size);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving size" });
  }
};

const updateCapacities = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const size = await Capacities.findByPk(id);

    if (!size) {
      return res.status(404).json({ message: "Capacities not found" });
    }

    size.name = name;
    await size.save();

    res.status(200).json({ message: "Capacities updated", size });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating size" });
  }
};

const deleteCapacities = async (req, res) => {
  try {
    const { id } = req.params;
    const size = await Capacities.findByPk(id);

    if (!size) {
      return res.status(404).json({ message: "Capacities not found" });
    }

    await size.destroy();
    res.status(200).json({ message: "Capacities deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting size" });
  }
};

module.exports = {
  createCapacities,
  getAllCapacitiess,
  getCapacitiesById,
  updateCapacities,
  deleteCapacities,
};