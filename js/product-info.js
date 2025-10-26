document.addEventListener("DOMContentLoaded", () => {
  const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
  const container = document.querySelector("main .container");
  const relacionadosContainer = document.getElementById("lista-productos-relacionados");
  const CATEGORY_PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";

  const productId = localStorage.getItem("productID");

  const temaGuardado = localStorage.getItem("tema"); // lee el tema guardado
  const body = document.body;
  const botonTema = document.getElementById("botonTema"); // si tenés un botón con texto/icono

  if (temaGuardado === "oscuro") {
    body.classList.add("oscuro");
    if (botonTema) botonTema.innerHTML = "Tema oscuro &#127769;"; // 🌙
  } else {
    body.classList.remove("oscuro");
    if (botonTema) botonTema.innerHTML = "Tema claro &#127774;"; // 🌞
  }


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
                  <img id="img-grande" src="${product.images[0]}" class="img-fluid mb-3" alt="${product.name}" style="max-height:350px;max-width:100%;border-radius: 15px;">
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
            <button id="btnComprar" class="btn btn-warning mb-3">Comprar</button>
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

      // === Productos relacionados ===
      const relacionados = product.relatedProducts;

      if (relacionados.length > 0 && relacionadosContainer) {
        relacionadosContainer.innerHTML = `
          <div class="row">
            ${relacionados.map(p => `
              <div class="col-md-4 mb-3">
                <div class="card h-100 producto-relacionado" data-id="${p.id}" style="cursor:pointer;">
                  <img src="${p.image}" class="card-img-top" alt="${p.name}" style="height:200px;object-fit:cover;">
                  <div class="card-body">
                    <h5 class="card-title">${p.name}</h5>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;

        document.querySelectorAll('.producto-relacionado').forEach(card => {
          card.addEventListener('click', function () {
            const newId = this.getAttribute('data-id');
            localStorage.setItem('productID', newId);
            location.reload();
          });
        });
      }

      // === COMENTARIOS DEL PRODUCTO ===
      const COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;

      fetch(COMMENTS_URL)
        .then(response => {
          if (!response.ok) throw new Error("Error al obtener comentarios");
          return response.json();
        })
        .then(comments => {
          mostrarComentarios(comments);
        })
        .catch(error => {
          console.error("Error al obtener comentarios:", error);
          const cont = document.getElementById("lista-comentarios");
          if (cont) cont.innerHTML = `<div class="alert alert-warning">No se pudieron cargar los comentarios.</div>`;
        });

      // Función para mostrar estrellas
      function mostrarEstrellas(score) {
        let estrellas = "";
        for (let i = 1; i <= 5; i++) {
          estrellas += i <= score ? "★" : "☆";
        }
        return `<span class="text-warning">${estrellas}</span>`;
      }

      // Función para mostrar comentarios en HTML
      function mostrarComentarios(lista) {
        const contenedor = document.getElementById("lista-comentarios");
        if (!contenedor) return;
        let html = "";

        lista.forEach(c => {
          html += `
            <div class="comentario card mb-3 shadow-sm">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0"><strong>${c.user}</strong></h6>
                  <small class="text-muted">${c.dateTime}</small>
                </div>
                <p class="mt-1 mb-1">${mostrarEstrellas(c.score)}</p>
                <p class="mb-0">${c.description}</p>
              </div>
            </div>
          `;
        });

        contenedor.innerHTML = html;
      }

      // Busca el botón y los campos del formulario de calificación
      function agregarManejadorCalificacion() {
        const btn = document.querySelector('.calificación-productos button');
        const textarea = document.querySelector('.calificación-productos textarea');
        const ratingInputs = document.querySelectorAll('.calificación-productos input[name="rating"]');
        const listaComentarios = document.getElementById("lista-comentarios");

        if (btn && textarea && ratingInputs.length && listaComentarios) {
          btn.addEventListener('click', function () {
            // Obtener el puntaje seleccionado
            let puntaje = 0;
            ratingInputs.forEach(input => {
              if (input.checked) puntaje = parseInt(input.value);
            });

            const texto = textarea.value.trim();
            if (!texto || puntaje === 0) {
              alert("Debes escribir un comentario y seleccionar una calificación.");
              return;
            }

            // Simular usuario y fecha
            const usuario = localStorage.getItem("usuario") || "Usuario";
            const fecha = new Date().toLocaleString();

            // Generar estrellas
            let estrellas = "";
            for (let i = 1; i <= 5; i++) {
              estrellas += i <= puntaje ? "★" : "☆";
            }

            // Crear el HTML del nuevo comentario
            const nuevoComentario = document.createElement("div");
            nuevoComentario.className = "comentario card mb-3 shadow-sm";
            nuevoComentario.innerHTML = `
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0"><strong>${usuario}</strong></h6>
                  <small class="text-muted">${fecha}</small>
                </div>
                <p class="mt-1 mb-1"><span class="text-warning">${estrellas}</span></p>
                <p class="mb-0">${texto}</p>
              </div>
            `;

            // Agregar el comentario al final de la lista
            listaComentarios.appendChild(nuevoComentario);

            // Limpiar campos
            textarea.value = "";
            ratingInputs.forEach(input => input.checked = false);
          });
        }
      }

      // Llama a la función después de renderizar el producto
      agregarManejadorCalificacion();

      // Manejar compra: guardar en localStorage en formato normalizado y redirigir a carrito
      const btnComprar = container.querySelector('#btnComprar');
      if (btnComprar) {
        btnComprar.addEventListener('click', () => {
          // Recuperar carrito actual (array) o crear uno nuevo
          const cartKey = 'cartItems';
          let cart = [];
          try {
            cart = JSON.parse(localStorage.getItem(cartKey)) || [];
          } catch (e) {
            cart = [];
          }

          // Crear item normalizado
          const item = {
            id: productId || product.id || String(Date.now()),
            name: product.name,
            price: Number(product.cost),
            currency: product.currency,
            qty: 1,
            image: product.images && product.images.length ? product.images[0] : ''
          };

          // Si ya existe el producto en el carrito, incrementar cantidad
          const existingIndex = cart.findIndex(it => it.id == item.id);
          if (existingIndex > -1) {
            cart[existingIndex].qty = Number(cart[existingIndex].qty) + 1;
          } else {
            cart.push(item);
          }

          // Guardar y redirigir
          try {
            localStorage.setItem(cartKey, JSON.stringify(cart));
            console.log('product-info: guardado en cartItems', cart);
          } catch (e) {
            console.error('product-info: error guardando cartItems', e);
          }
          window.location.href = 'cart.html';
        });
      }

    })
    .catch(error => {
      container.innerHTML = `<div class="alert alert-danger">No se pudo cargar la información del producto.</div>`;
    });
});

function comprar(){
  // Si existe un objeto preparado en memoria, guárdalo y redirige.
  if (window.currentCartProduct) {
    try {
      localStorage.setItem('cartProduct', JSON.stringify(window.currentCartProduct));
      console.log('comprar(): guardado cartProduct desde window.currentCartProduct', window.currentCartProduct);
    } catch (e) {
      console.error('comprar(): error al guardar en localStorage', e);
    }
  }
  // Ir al carrito en cualquier caso
  window.location.href = "cart.html";
}

// Nota: la acción de comprar se maneja dentro del alcance donde se carga el producto
// (se dejó la función global ya que antes existía, pero la lógica principal se adjunta al botón)