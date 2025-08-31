document.addEventListener("DOMContentLoaded", function() {
    let usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
        document.querySelector(".idUsuario").innerHTML = usuarioGuardado;
    } else {
        window.location.href = "login.html";
    }
});