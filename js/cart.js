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

  if (!cart) cart = [];
  // mostrar vacío inicialmente si corresponde (no retornamos para mantener listeners activos)
  if (cart.length === 0) {
    emptyCart.style.display = "block";
    actualizarBadge(); // 👈 agregado para actualizar cuando está vacío
  }

  const fmt = (n) => {
    try { return Number(n).toLocaleString(navigator.language || 'es-ES'); } catch (e) { return n; }
  };

  function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
    actualizarBadge(); // 👈 agregado para actualizar badge al guardar
  }

  // Calcula y actualiza el resumen de costos (subtotal, envío, total)
  function updateSummary() {
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryEnvio = document.getElementById('summary-envio');
    const summaryTotal = document.getElementById('summary-total');
    const leftTotal = document.getElementById('total'); // total mostrado en la tarjeta izquierda

    const subtotal = cart.reduce((acc, it) => acc + Number(it.price) * Number(it.qty), 0);

    // Determinar porcentaje según radio seleccionado
    let rate = 0.05;
    const envioPremium = document.getElementById('envioPremium');
    const envioExpress = document.getElementById('envioExpress');
    const envioStandard = document.getElementById('envioStandard');
    if (envioPremium && envioPremium.checked) rate = 0.15;
    else if (envioExpress && envioExpress.checked) rate = 0.07;
    else if (envioStandard && envioStandard.checked) rate = 0.05;

    const envioCost = subtotal > 0 ? subtotal * rate : 0;
    const total = subtotal + envioCost;

    if (summarySubtotal) summarySubtotal.textContent = fmt(subtotal);
    if (summaryEnvio) summaryEnvio.textContent = fmt(envioCost);
    if (summaryTotal) summaryTotal.textContent = fmt(total);
    if (leftTotal) leftTotal.textContent = fmt(total);

    // Habilitar/deshabilitar botones de checkout
    const checkoutBtns = document.querySelectorAll('#checkoutBtn');
    checkoutBtns.forEach(b => {
      if (cart.length === 0) b.setAttribute('disabled', 'disabled'); else b.removeAttribute('disabled');
    });
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
    // Si el carrito está vacío, mostrar mensaje y actualizar resumen
    if (cart.length === 0) {
      cartContainer.innerHTML = '';
      emptyCart.style.display = 'block';
      updateSummary();
      return;
    }
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


  // Summary (vacío)
  cartContainer.innerHTML = html;

  // Actualizar resumen y total izquierdo
  updateSummary();

    // Listeners: qty change
    const qtyInputs = cartContainer.querySelectorAll('.qty-input');
    qtyInputs.forEach((input, i) => {
      input.addEventListener('change', () => {
        let v = parseInt(input.value);
        if (isNaN(v) || v < 1) v = 1;
        cart[i].qty = v;
        const newSubtotal = Number(cart[i].price) * v;
        const subtotalEl = cartContainer.querySelectorAll('.subtotal')[i];
        subtotalEl.textContent = `${cart[i].currency} ${fmt(newSubtotal)}`;
        const totalNow = cart.reduce((acc, it) => acc + Number(it.price) * Number(it.qty), 0);
    document.getElementById("summary-subtotal").textContent = fmt(totalNow);
    document.getElementById("summary-total").textContent = fmt(totalNow);

        saveCart(); // guarda y actualiza badge
        updateSummary();
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
        updateSummary();
      });
    });

    // Conectar todos los botones de checkout presentes en la página
    const checkoutBtns = document.querySelectorAll('#checkoutBtn');
    checkoutBtns.forEach(btn => {
  btn.addEventListener('click', () => {

    // --- Validación; carrito no vacío ---
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    // --- Validación: dirección completa ---
    const nombre = document.querySelector('input[placeholder="Juan Pérez"]');
    const departamento = document.querySelector('input[placeholder="Ej: Montevideo"]');
    const localidad = document.querySelector('input[placeholder="Ej: Pocitos"]');
    const calle = document.querySelector('input[placeholder="Av. Principal 1234"]');
    const esquina = document.querySelector('input[placeholder="Ej: Paraguay"]');
    
    if (
      !nombre.value.trim() ||
      !departamento.value.trim() ||
      !localidad.value.trim() ||
      !calle.value.trim() ||
      !esquina.value.trim()
    ) {
      alert("Debes completar todos los campos de la dirección.");
      return;
    }

    // --- Validación: forma de envío seleccionada ---
    const envioSeleccionado = document.querySelector('input[name="envio"]:checked');
    if (!envioSeleccionado) {
      alert("Debes seleccionar un tipo de envío.");
      return;
    }

    // --- Validación: cantidades válidas (ya tenés min=1 pero igual se valida) ---
    for (let item of cart) {
      if (!item.qty || item.qty <= 0) {
        alert("Las cantidades deben ser mayores a cero.");
        return;
      }
    }

    // --- Validación: forma de pago seleccionada ---
    const pagoSeleccionado = document.querySelector('input[name="pago"]:checked');
    if (!pagoSeleccionado) {
      alert("Debes seleccionar una forma de pago.");
      return;
    }

    // Si más adelante agregás inputs extra para tarjeta o transferencia,

    // --- SI TODO ES CORRECTO -> compra exitosa ---
    alert("Compra realizada con éxito ✔️");

    localStorage.removeItem(cartKey);
    cart = [];
    cartContainer.innerHTML = '';
    emptyCart.style.display = 'block';
    actualizarBadge();
    updateSummary();
  });
});


    actualizarBadge(); // 👈 asegura sincronización inicial
    updateSummary(); // actualizar resumen derecho al renderizar
  }

  // Inicial render
  render();

  // Listener para cambios en el tipo de envío (actualiza resumen en tiempo real)
  const shippingForm = document.getElementById('shippingForm');
  if (shippingForm) shippingForm.addEventListener('change', updateSummary);
});