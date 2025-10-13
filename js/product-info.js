document.addEventListener("DOMContentLoaded", () => {
  const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
  const container = document.querySelector("main .container");
  const relacionadosContainer = document.getElementById("lista-productos-relacionados");
  const CATEGORY_PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";



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
                <h2 class="text-success">${product.currency} ${product.cost}</h2>
                <p><strong>Vendidos:</strong> ${product.soldCount}</p>
                <p><strong>Categoría:</strong> ${product.category}</p>
                <p><strong>Calificacion: s/c<strong></p>
                <a href="#comentarios"><strong>Ver opiniones:</strong></a>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-12">
                <h5>Descripción del producto</h5>
                <p>${product.description}</p>
              </div>
            </div>
            <div class="calificación-productos">
              <h5>Califica este producto</h5>
              <div class="rating">
                 <input type="radio" id="star1" name="rating" value="1">
                <label for="star1">1 ★</label>

                 <input type="radio" id="star2" name="rating" value="2">
                 <label for="star2">2 ★</label>

                 <input type="radio" id="star3" name="rating" value="3">
                  <label for="star3">3 ★</label>

                 <input type="radio" id="star4" name="rating" value="4">
                 <label for="star4">4 ★</label>

                <input type="radio" id="star5" name="rating" value="5">
                 <label for="star5">5 ★</label>
              </div>
              <textarea placeholder="Escribe tu comentario..."></textarea>
              <br>
              <button onclick="enviarCalificación()">Enviar</button>
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
        mini.addEventListener('click', function () {
          imgGrande.src = this.src;
        });
      });

      // Obtener productos relacionados
      fetch(PRODUCTS_URL + product.category_id + ".json")
       .then(res => res.json())
       .then(data => {
          const relacionados = data.products
            .filter(p => p.id != product.id) // Excluye el producto actual
            .slice(0, 3); // Solo 3 productos

         if (relacionados.length > 0 && relacionadosContainer) {
            relacionadosContainer.innerHTML = `
             <h4 class="mb-3">Productos relacionados</h4>
              <div class="row">
                ${relacionados.map(p => `
                  <div class="col-md-4 mb-3">
                     <div class="card h-100 producto-relacionado" data-id="${p.id}" style="cursor:pointer;">
                       <img src="${p.image}" class="card-img-top" alt="${p.name}" style="height:200px;object-fit:cover;">
                      <div class="card-body">
                        <h5 class="card-title">${p.name}</h5>
                        <p class="card-text">${p.currency} ${p.cost}</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
           `;

         // Evento click en cada producto relacionado para cargar nuevo producto
         document.querySelectorAll('.producto-relacionado').forEach(card => {
            card.addEventListener('click', function () {
              const newId = this.getAttribute('data-id');
              localStorage.setItem('productID', newId);
              location.reload();
            });
          });
        }
      });


    })


    .catch(error => {
      container.innerHTML = `<div class="alert alert-danger">No se pudo cargar la información del producto.</div>`;
    });
});

// Obtener productos relacionados
const relacionadosContainer = document.getElementById("lista-productos-relacionados");

fetch(PRODUCTS_URL + product.category_id + ".json")
  .then(res => res.json())
  .then(data => {
    const relacionados = data.products
      .filter(p => p.id != product.id) // Excluye el producto actual
      .slice(0, 3); // Solo 3 productos

    if (relacionados.length > 0 && relacionadosContainer) {
      relacionadosContainer.innerHTML = `
        <h4 class="mb-3">Productos relacionados</h4>
        <div class="row">
          ${relacionados.map(p => `
            <div class="col-md-4 mb-3">
              <div class="card h-100 producto-relacionado" data-id="${p.id}" style="cursor:pointer;">
                <img src="${p.image}" class="card-img-top" alt="${p.name}" style="height:200px;object-fit:cover;">
                <div class="card-body">
                  <h5 class="card-title">${p.name}</h5>
                  <p class="card-text">${p.currency} ${p.cost}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Evento click en cada producto relacionado para cargar nuevo producto
      document.querySelectorAll('.producto-relacionado').forEach(card => {
        card.addEventListener('click', function () {
          const newId = this.getAttribute('data-id');
          localStorage.setItem('productID', newId);
          location.reload();
        });
      });
    }
  });
