document.addEventListener("DOMContentLoaded", () => {
  const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
  const containerEspecial = document.querySelector("main .containerEspecial");

  let filteredProducts = []; 
  let minPrice = null;
  let maxPrice = null;
  
  let idCategoria = localStorage.getItem("catID");

  const PRODUCTS_SELECTED = PRODUCTS_URL + idCategoria + ".json";

  fetch(PRODUCTS_SELECTED)
    .then(response => {
      if (!response.ok) throw new Error("Error en la respuesta");
      return response.json();
    })
    .then(data => {
      filteredProducts = data.products; // inicializamos todos los productos
      renderFilteredProducts();
    })
    .catch(error => {
      console.error("Error al cargar productos:", error);
      containerEspecial.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los productos </div>`;
    });

  // sidebar lateral
  const toggleBtn = document.getElementById("toggleFilterBtn");
  const filterPanel = document.getElementById("filterPanel");
  const applyBtn = document.getElementById("applyFilterBtn");
  const clearBtn = document.getElementById("clearFilterBtn");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const closeBtn = document.getElementById("closeFilterBtn");

  closeBtn.addEventListener("click", () => {
    filterPanel.classList.remove("active", "open");
  });

  toggleBtn.addEventListener("click", () => {
    filterPanel.classList.toggle("open");
  });

  applyBtn.addEventListener("click", () => {
    minPrice = parseInt(minPriceInput.value) || null;
    maxPrice = parseInt(maxPriceInput.value) || null;
    applyFilter();
  });

  clearBtn.addEventListener("click", () => {
    minPriceInput.value = "";
    maxPriceInput.value = "";
    minPrice = null;
    maxPrice = null;
    applyFilter();
  });

  function applyFilter() {
    let productsToRender = filteredProducts;

    if (minPrice !== null || maxPrice !== null) {
      productsToRender = filteredProducts.filter(p => {
        return (minPrice === null || p.cost >= minPrice) &&
               (maxPrice === null || p.cost <= maxPrice);
      });
    }

    renderFilteredProducts(productsToRender);
  }

  // Función para renderizar productos
  function renderFilteredProducts(products = filteredProducts) {
    containerEspecial.innerHTML = "";

    if (products.length === 0) {
      containerEspecial.innerHTML = `<div class="alert alert-warning text-center">No hay productos en este rango de precio</div>`;
    } else {
      products.forEach(product => {
        const productHTML = `
          <div class="muestra-articulo-clase product-item" data-product-id="${product.id}" style="cursor:pointer;">
            <div class="img-product-clase">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="txt-product-clase">
              <h5>${product.name} - 
                  <span class="text-success">${product.currency} ${product.cost}</span></h5>
              <p>${product.description}</p>
              <p><small class="text-muted">Vendidos: ${product.soldCount}</small></p>
            </div>
          </div>`;
        containerEspecial.innerHTML += productHTML;
      });

      // Agregar evento a cada producto
      document.querySelectorAll('.product-item').forEach(item => {
        item.addEventListener('click', function() {
          const productId = this.getAttribute('data-product-id');
          localStorage.setItem('productID', productId);
          window.location = 'product-info.html';
        });
      });
    }
  }

  // Ordenar productos
  const sortText = document.getElementById("sortText");
  const sortLow = document.getElementById("sortLow");
  const sortHigh = document.getElementById("sortHigh");

  sortText.addEventListener("click", () => {
    sortText.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!sortText.contains(e.target)) {
      sortText.classList.remove("active");
    }
  });
  sortLow.addEventListener("click", () => {
    filteredProducts.sort((a, b) => a.cost - b.cost);
    applyFilter(); // Aplicar filtro si está activo
    sortText.classList.remove("active");
  });
  sortHigh.addEventListener("click", () => {
    filteredProducts.sort((a, b) => b.cost - a.cost);
    applyFilter(); // Aplicar filtro si está activo
    sortText.classList.remove("active");
  });

});