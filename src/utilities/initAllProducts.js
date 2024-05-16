// const postProduct = require("../controllers/product/postProduct");

const allProducts = [

  {
    title: "MacBook Pro 13 pulgadas M1",
    description: "Potente laptop con chip M1 para un rendimiento excepcional.",
    price: 1299,
    discount: 10,
    category: "Laptops",
    color: ["Gris Espacial", "Plata"],
    sizes: [
      {
        size: "13 pulgadas",
        stock: 50,
      },
    ],
    images: [
      "https://example.com/macbookpro13-grisespacial.jpg",
      "https://example.com/macbookpro13-plata.jpg",
    ],
  },
  {
    title: "iPhone 13 Pro",
    description: "El último iPhone con cámara Pro y pantalla ProMotion.",
    price: 1099,
    discount: 5,
    category: "Smartphones",
    color: ["Grafito", "Oro", "Plata", "Sierra Azul"],
    sizes: [
      {
        size: "128GB",
        stock: 30,
      },
      {
        size: "256GB",
        stock: 20,
      },
      {
        size: "512GB",
        stock: 10,
      },
    ],
    images: [
      "https://example.com/iphone13pro-grafito.jpg",
      "https://example.com/iphone13pro-oro.jpg",
      "https://example.com/iphone13pro-plata.jpg",
      "https://example.com/iphone13pro-sierraazul.jpg",
    ],
  },
];

module.exports = { allProducts };