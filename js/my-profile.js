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

// === Código del perfil ===
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");
  const emailInput = document.getElementById("email");
  const fileInput = document.getElementById("profilePic");
  const preview = document.getElementById("preview");

  // Precargar email desde localStorage
  const storedEmail = localStorage.getItem("user");
  if (storedEmail) emailInput.value = storedEmail;

  // Cargar datos guardados
  const profile = JSON.parse(localStorage.getItem("profileData"));
  if (profile) {
    document.getElementById("firstName").value = profile.firstName || "";
    document.getElementById("lastName").value = profile.lastName || "";
    document.getElementById("phone").value = profile.phone || "";
  }

    // Mostrar imagen guardada al iniciar
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    preview.src = savedImage;
  }
  // Mostrar imagen y guardar en localStorage
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    preview.src = event.target.result;               // mostrar imagen
    localStorage.setItem("profileImage", event.target.result); // guardar en localStorage
  };
  reader.readAsDataURL(file);
});

  // Guardar datos del perfil
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      phone: document.getElementById("phone").value
    };
    localStorage.setItem("profileData", JSON.stringify(data));
    alert("Perfil guardado correctamente");
  });
});
