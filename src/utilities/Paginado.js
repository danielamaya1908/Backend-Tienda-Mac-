const Paginado = (page, limit, products) => {
  //paginado -----> habría que llevar la lógica del paginado a utilities
  const currentPage = page ? parseInt(page) : 1;
  const limitPage = limit ? parseInt(limit) : 12;
  const offset = (currentPage - 1) * limitPage;

  const baseUrl = "http://localhost:3005/Inventario";

  let previousPage = "";

  if (currentPage !== 1) {
    previousPage = `${baseUrl}?page=${Math.max(1, currentPage - 1)}&limit=${limit}`;
  } else {
    previousPage = null;
  }

  const totalItems = products;

  const totalPages = Math.ceil(totalItems / limit);

  let nextPage = null;

  if (currentPage < totalPages) {
    nextPage = `${baseUrl}?page=${currentPage + 1}&limit=${limit}`;
  }
  const resultado = {
    previousPage,
    nextPage,
    limitPage,
    currentPage,
    offset,
  };

  return resultado;
};

module.exports = Paginado;
