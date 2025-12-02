// init.js (¡Copia y pega esto para reemplazar las URLs antiguas!)

// 💡 BASE URL apuntando a tu backend local (Puerto 3000 y ruta /api)
const API_BASE = "http://localhost:3000/api/"; 

// Las URLs ahora usan la base local para buscar los JSONs
const CATEGORIES_URL = API_BASE + "cats/cat.json";
const PUBLISH_PRODUCT_URL = API_BASE + "sell/publish.json";
const PRODUCTS_URL = API_BASE + "cats_products/";
const PRODUCT_INFO_URL = API_BASE + "products/";
const PRODUCT_INFO_COMMENTS_URL = API_BASE + "products_comments/";
const CART_INFO_URL = API_BASE + "user_cart/";
const CART_BUY_URL = API_BASE + "cart/buy.json";
const EXT_TYPE = ".json";

// ... el resto de tu código (showSpinner, getJSONData, etc.) queda igual.

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
function actualizarBadge() {
  const btnCarrito = document.getElementById('btnCarrito');
  if (!btnCarrito) return;

  const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalItems = cart.reduce((acc, item) => acc + Number(item.qty), 0);

  const badge = btnCarrito.querySelector('span.badge');
  if (badge) badge.textContent = totalItems;
}

// Actualiza al cargar la página
document.addEventListener("DOMContentLoaded", actualizarBadge);
