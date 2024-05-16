function quitarTildes(texto) {
    return texto
      .normalize("NFD") // Normalizar caracteres con diacríticos
      .replace(/[\u0300-\u036f]/g, ""); // Eliminar diacríticos
}

function quitarSignos(texto) {
  return texto
    .replace(/[áäâà]/g, 'a')
    .replace(/[éëêè]/g, 'e')
    .replace(/[íïîì]/g, 'i')
    .replace(/[óöôò]/g, 'o')
    .replace(/[úüûù]/g, 'u')
    .replace(/[ñ]/g, 'n');
}

module.exports = { quitarTildes, quitarSignos }