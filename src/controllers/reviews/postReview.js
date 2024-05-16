const { Reviews, Orders } = require("../../db");

const postReview = async (req, res) => {
  try {
    const { UserId, ProductId, score, description, status } = req.body;

    //   const order = await Orders.findOne({ where: { userId, productId } });

    //   if (!order) {
    //     return res.status(403).json({ message: "El usuario no ha comprado este producto." });
    //   }

    const existingReview = await Reviews.findOne({
      where: {
        UserId,
        ProductId,
      },
    });

    if (existingReview) {
      return res.status(400).json({ message: "El usuario ya ha realizado una reseña para este producto." });
    }

    let review = await Reviews.create({
      UserId,
      ProductId,
      score,
      description,
    });
    review = await Reviews.update(
      {
        status,
      },
      {
        where: { UserId: UserId, ProductId: ProductId },
        individualHooks: true,
      }
    );

    return res.status(201).json({
      message: "Tu reseña fue exitosa",
      data: review,
    });
  } catch (error) {
    console.error("Error al publicar la reseña:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = postReview;
