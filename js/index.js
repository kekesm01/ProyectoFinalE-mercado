if(localStorage.getItem("usuario")){

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });

});
}else{
    window.location.href = "login.html"
}

document.addEventListener("DOMContentLoaded", function() {
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
});
