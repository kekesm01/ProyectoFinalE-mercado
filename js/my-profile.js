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