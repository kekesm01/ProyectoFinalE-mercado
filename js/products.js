document.addEventListener("DOMContentLoaded", () => {
  const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
  const containerEspecial = document.querySelector("main .containerEspecial");

  let idCategoria = localStorage.getItem("catID");

  const PRODUCTS_SELECTED = PRODUCTS_URL + idCategoria + ".json";

  fetch(PRODUCTS_SELECTED)
    .then(response => {
      if (!response.ok) throw new Error("Error en la respuesta");
      return response.json();
    })
    .then(data => {
      containerEspecial.innerHTML = "";

      data.products.forEach(product => {
        containerEspecial.innerHTML += `
        <div class = "muestra-articulo-clase">
              <div class = "img-product-clase">
                <img src="${product.image}" alt="${product.name}">
              </div>
              <div class="txt-product-clase">
                  <h5 class="card-title">${product.name} - <span class="text-success">${product.currency} ${product.cost}</span></h5>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text"><small class="text-muted">Vendidos: ${product.soldCount}</small></p>
              </div>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error("Error al cargar productos:", error);
      container.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los productos </div>`;
    });
});