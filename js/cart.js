document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const emptyCart = document.getElementById("empty-cart");

  // Cargar producto del localStorage
  const productJSON = localStorage.getItem("cartProduct");
  if (!productJSON) {
    emptyCart.style.display = "block";
    return;
  }

  const product = JSON.parse(productJSON);

  // Mostrar producto
  cartContainer.innerHTML = `
    <div class="card mb-3 shadow-sm">
      <div class="row g-0 align-items-center">
        <div class="col-md-3 text-center">
          <img src="${product.image}" class="img-fluid p-2" alt="${product.name}">
        </div>
        <div class="col-md-9">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Precio: ${product.currency} ${product.price}</p>
            <div class="mb-2">
              <label for="qty">Cantidad:</label>
              <input type="number" id="qty" min="1" value="${product.qty}" style="width:80px;">
            </div>
            <p class="card-text">Subtotal: <span id="subtotal">${product.currency} ${product.price * product.qty}</span></p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Actualizar subtotal en tiempo real
  const qtyInput = document.getElementById("qty");
  const subtotalEl = document.getElementById("subtotal");

  qtyInput.addEventListener("input", () => {
    let qty = parseInt(qtyInput.value);
    if (isNaN(qty) || qty < 1) qty = 1;
    subtotalEl.textContent = `${product.currency} ${product.price * qty}`;

    // Guardar la nueva cantidad en localStorage
    product.qty = qty;
    localStorage.setItem("cartProduct", JSON.stringify(product));
  });
});