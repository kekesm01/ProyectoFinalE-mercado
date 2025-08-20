document.addEventListener("DOMContentLoaded", () => {
  const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
  const container = document.querySelector("main .container");

  fetch(PRODUCTS_URL)
    .then(response => {
      if (!response.ok) throw new Error("Error en la respuesta");
      return response.json();
    })
    .then(data => {
      container.innerHTML = "";

      data.products.forEach(product => {
        container.innerHTML += `
          <div class="card mb-3 shadow-sm">
            <div class="row g-0">
              <div class="col-md-4">
                <img src="${product.image}" class="img-fluid rounded-start" alt="${product.name}">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${product.name} - <span class="text-success">${product.currency} ${product.cost}</span></h5>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text"><small class="text-muted">Vendidos: ${product.soldCount}</small></p>
                </div>
              </div>
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