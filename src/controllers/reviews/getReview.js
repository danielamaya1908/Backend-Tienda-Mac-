const { Reviews, Product, product_images, Image } = require("../../db");

const getReview = async (req, res) => {
  try {
    const { status, productId, reviewId, userId } = req.query;

    const includeOptions = [
      {
        model: Product,
        attributes: ["title"],
        include: [
          {
            model: Image,
            attributes: ["url"],
            through: { attributes: [] },
          },
        ],
      },
    ];

    if (!status && !productId && !reviewId && !userId) {
      const reviews = await Reviews.findAll({
        include: includeOptions,
      });

      const mappedReviews = reviews.map((review) => {
        const imageUrls = review.Product.Images.map((image) => image.url);

        return {
          id: review.id,
          score: review.score,
          description: review.description,
          status: review.status,
          UserId: review.UserId,
          ProductId: review.ProductId,
          Product: {
            title: review.Product.title,
            Images: imageUrls,
          },
        };
      });

      return res.status(200).json({
        message: "OK",
        data: mappedReviews,
      });
    }

    if (status && !productId && !reviewId && !userId) {
      const reviews = await Reviews.findAll({
        where: {
          status: status,
        },
        include: includeOptions,
      });

      if (!reviews.length) {
        return res.status(400).json({ message: `No se encuentran reseñas con status: ${status}.` });
      }

      const mappedReviews = reviews.map((review) => {
        const imageUrls = review.Product.Images.map((image) => image.url);

        return {
          id: review.id,
          score: review.score,
          description: review.description,
          status: review.status,
          UserId: review.UserId,
          ProductId: review.ProductId,
          Product: {
            title: review.Product.title,
            Images: imageUrls,
          },
        };
      });
      return res.status(200).json({
        message: "OK",
        data: mappedReviews,
      });
    }

    if (!status && productId && !reviewId && !userId) {
      const reviews = await Reviews.findAll({
        where: {
          ProductId: productId,
        },
        include: includeOptions,
      });

      if (!reviews.length) {
        return res.status(200).json({ message: "Este producto aun no tiene comentarios" });
      }
      const mappedReviews = reviews.map((review) => {
        const imageUrls = review.Product.Images.map((image) => image.url);

        return {
          id: review.id,
          score: review.score,
          description: review.description,
          status: review.status,
          UserId: review.UserId,
          ProductId: review.ProductId,
          Product: {
            title: review.Product.title,
            Images: imageUrls,
          },
        };
      });
      return res.status(200).json({
        message: "OK",
        data: mappedReviews,
      });
    }
    if (reviewId && !productId && !status && !userId) {
      const reviews = await Reviews.findAll({
        where: {
          id: reviewId,
        },
        include: includeOptions,
      });

      if (!reviews.length) {
        return res.status(400).json({ message: `No se encuentran reseñas con ID: ${reviewId}.` });
      }
      const mappedReviews = reviews.map((review) => {
        const imageUrls = review.Product.Images.map((image) => image.url);

        return {
          id: review.id,
          score: review.score,
          description: review.description,
          status: review.status,
          UserId: review.UserId,
          ProductId: review.ProductId,
          Product: {
            title: review.Product.title,
            Images: imageUrls,
          },
        };
      });
      return res.status(200).json({
        message: "OK",
        data: mappedReviews,
      });
    }
    if (!reviewId && productId && !status && userId) {
      const reviews = await Reviews.findAll({
        where: {
          ProductId: productId,
          UserId: userId,
        },
        include: includeOptions,
      });

      if (!reviews.length) {
        return res.status(400).json({
          message: `No se encuentran reseñas del UserID: ${userId}, que coincidan con el productID: ${productId}`,
        });
      }
      const mappedReviews = reviews.map((review) => {
        const imageUrls = review.Product.Images.map((image) => image.url);

        return {
          id: review.id,
          score: review.score,
          description: review.description,
          status: review.status,
          UserId: review.UserId,
          ProductId: review.ProductId,
          Product: {
            title: review.Product.title,
            Images: imageUrls,
          },
        };
      });
      return res.status(200).json({
        message: "OK",
        data: mappedReviews,
      });
    }
  } catch (error) {
    console.error("Error al intentar encontrar reseñas:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = getReview;
