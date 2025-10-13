document.addEventListener("DOMContentLoaded", () => {
  const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
  const container = document.querySelector("main .container");

  const productId = localStorage.getItem("productID");

  if (!productId) {
    container.innerHTML = `<div class="alert alert-danger">No se encontró el producto seleccionado.</div>`;
    return;
  }

  fetch(PRODUCT_INFO_URL + productId + ".json")
    .then(response => {
      if (!response.ok) throw new Error("Error en la respuesta");
      return response.json();
    })
    .then(product => {
      container.innerHTML = `
        <div class="card shadow mb-5">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 d-flex">
                <div class="d-flex flex-column align-items-center me-3" id="miniaturas">
                  ${product.images.map((img, i) => `
                    <img src="${img}" class="img-thumbnail mb-2 miniatura" data-index="${i}" style="width:70px;height:70px;object-fit:cover;cursor:pointer;">
                  `).join('')}
                </div>
                <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                  <img id="img-grande" src="${product.images[0]}" class="img-fluid mb-3" alt="${product.name}" style="max-height:350px;max-width:100%;">
                </div>
              </div>
              <div class="col-md-6">
                <h2>${product.name}</h2>
                <h4 class="text-success">${product.currency} ${product.cost}</h4>
                <p><strong>Vendidos:</strong> ${product.soldCount}</p>
                <p><strong>Categoría:</strong> ${product.category}</p>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-12">
                <h5>Descripción del producto</h5>
                <p>${product.description}</p>
              </div>
            </div>
            <div class="volverAtrasProducts-info">
              <a href="products.html">Volver atrás</a>
            </div>
          </div>

        </div>
      `;

      // Lógica para cambiar la imagen grande al hacer click en miniatura
      const miniaturas = container.querySelectorAll('.miniatura');
      const imgGrande = container.querySelector('#img-grande');
      miniaturas.forEach(mini => {
        mini.addEventListener('click', function() {
          imgGrande.src = this.src;
        });
      });
    })
    .catch(error => {
      container.innerHTML = `<div class="alert alert-danger">No se pudo cargar la información del producto.</div>`;
    });
});