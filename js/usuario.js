document.addEventListener("DOMContentLoaded", function () {

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

    let usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
        document.getElementById("personalizacionPerfil").textContent = usuarioGuardado;
    } else {
        window.location.href = "login.html";
    }
});


const toggleBtn = document.getElementById("personalizacionPerfil");
const filterPanel = document.getElementById("filterPanelPerfil");
const closeBtn = document.getElementById("closeFilterBtn");

closeBtn.addEventListener("click", () => {
    filterPanel.classList.remove("active", "open");
});

toggleBtn.addEventListener("click", () => {
    filterPanel.classList.toggle("open");
});

function cambiarTema() {
    const body = document.body;
    const botonTema = document.getElementById("botonTema");

    // Alternar clase
    body.classList.toggle("oscuro");

    // Guardar el estado actual
    if (body.classList.contains("oscuro")) {
        localStorage.setItem("tema", "oscuro");
        if (botonTema) botonTema.innerHTML = "Tema oscuro &#127769;"; // 🌙
    } else {
        localStorage.setItem("tema", "claro");
        if (botonTema) botonTema.innerHTML = "Tema claro &#127774;"; // 🌞
    }
}