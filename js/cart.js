document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const emptyCart = document.getElementById("empty-cart");
  const cartKey = 'cartItems';
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  } catch (e) {
    cart = [];
  }
  console.log('cart.js: cartItems loaded =', cart);

  if (!cart || cart.length === 0) {
    emptyCart.style.display = "block";
    actualizarBadge(); // 👈 agregado para actualizar cuando está vacío
    return;
  }

  const fmt = (n) => {
    try { return Number(n).toLocaleString(navigator.language || 'es-ES'); } catch (e) { return n; }
  };

  function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
    actualizarBadge(); // 👈 agregado para actualizar badge al guardar
  }

  // 👇 Función nueva: actualiza el badge del carrito (cantidad total)
  function actualizarBadge() {
    const btnCarrito = document.getElementById('btnCarrito');
    if (!btnCarrito) return;

    const totalItems = cart.reduce((acc, item) => acc + Number(item.qty), 0);
    const badge = btnCarrito.querySelector('span.badge');
    if (badge) badge.textContent = totalItems;
  }

  function render() {
    emptyCart.style.display = 'none';
    let html = '';

    // Items
    cart.forEach((product, index) => {
      const subtotal = Number(product.price) * Number(product.qty);
      html += `
        <div class="card mb-3 shadow-sm cart-card" data-index="${index}">
          <div class="row g-0 align-items-center">
            <div class="col-md-3 text-center p-3">
              <img src="${product.image}" class="img-fluid rounded" alt="${product.name}" style="max-height:140px;object-fit:cover;">
            </div>
            <div class="col-md-6">
              <div class="card-body">
                <h5 class="card-title mb-1">${product.name}</h5>
                <p class="text-muted mb-1 small">Precio unitario: <strong>${product.currency} ${fmt(product.price)}</strong></p>
                <div class="d-flex align-items-center mt-2">
                  <label class="me-2 mb-0">Cantidad:</label>
                  <input type="number" class="form-control form-control-sm qty-input" min="1" value="${product.qty}" style="width:100px;">
                  <button class="btn btn-outline-danger btn-sm ms-3 remove-btn">Eliminar</button>
                </div>
              </div>
            </div>
            <div class="col-md-3 text-center">
              <div class="p-3">
                <p class="mb-1 small text-muted">Subtotal</p>
                <h5 class="text-primary subtotal">${product.currency} ${fmt(subtotal)}</h5>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    // Summary
    const total = cart.reduce((acc, it) => acc + Number(it.price) * Number(it.qty), 0);
    html += `
      <div class="card p-3 shadow-sm cart-summary">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <small class="text-muted">Total</small>
            <div class="h4 mt-1">${cart[0].currency} <span id="total">${fmt(total)}</span></div>
          </div>
          <div>
            <button id="checkoutBtn" class="btn btn-success">Procesar compra</button>
          </div>
        </div>
      </div>
    `;

    cartContainer.innerHTML = html;

    // Listeners: qty change
    const qtyInputs = cartContainer.querySelectorAll('.qty-input');
    qtyInputs.forEach((input, i) => {
      input.addEventListener('input', () => {
        let v = parseInt(input.value);
        if (isNaN(v) || v < 1) v = 1;
        cart[i].qty = v;
        const newSubtotal = Number(cart[i].price) * v;
        const subtotalEl = cartContainer.querySelectorAll('.subtotal')[i];
        subtotalEl.textContent = `${cart[i].currency} ${fmt(newSubtotal)}`;
        const totalEl = document.getElementById('total');
        const totalNow = cart.reduce((acc, it) => acc + Number(it.price) * Number(it.qty), 0);
        totalEl.textContent = fmt(totalNow);
        saveCart(); // guarda y actualiza badge
      });
    });

    // Listener: eliminar producto
    const removeBtns = cartContainer.querySelectorAll('.remove-btn');
    removeBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        cart.splice(i, 1);
        saveCart();
        if (cart.length === 0) {
          cartContainer.innerHTML = '';
          emptyCart.style.display = 'block';
        } else {
          render();
        }
        actualizarBadge(); // 👈 agregado para actualizar al eliminar
      });
    });

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        alert('Proceso de compra (prototipo): gracias por su compra.');
        localStorage.removeItem(cartKey);
        cart = [];
        cartContainer.innerHTML = '';
        emptyCart.style.display = 'block';
        actualizarBadge(); // 👈 agregado para vaciar el badge
      });
    }

    actualizarBadge(); // 👈 asegura sincronización inicial
  }

  // Inicial render
  render();
});