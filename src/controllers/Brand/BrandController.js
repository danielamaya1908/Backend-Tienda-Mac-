// controllers/brandController.js
const { Brand } = require("../../db");

const createBrand = async (req, res) => {
    try {
      const { name, image } = req.body;
      console.log('Request Body:', req.body);

      if (!name || !image) {
        return res.status(400).json({ error: 'Name and Image are required' });
      }
  
      const brand = await Brand.create({ name, image });
      console.log('Created Brand:', brand);
      return res.status(201).json(brand);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
};

  
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving brands" });
  }
};

const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving brand" });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    brand.name = name;
    brand.description = description;
    await brand.save();

    res.status(200).json({ message: "Brand updated", brand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating brand" });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    await brand.destroy();
    res.status(200).json({ message: "Brand deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting brand" });
  }
};

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
