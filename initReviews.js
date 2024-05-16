const postReview = require("./src/controllers/reviews/postReview");
const allReviews = require("./src/utilities/initReviews");

async function initializeReviews() {
  try {
    const resultados = [];
    for (const reviewData of allReviews) {
      const req = { body: reviewData };
      const res = {
        status: (code) => ({
          json: (data) => {
            resultados.push({ code, data });
          },
        }),
      };

      await postReview(req, res);
    }

    console.log("Reviews inicializados con éxito.");
  } catch (error) {
    console.error("Error al inicializar las Reviews:", error.message);
  }
}

initializeReviews();

module.exports = initializeReviews;
