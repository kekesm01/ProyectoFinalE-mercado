let botonIngresar = document.getElementById("boton-ingresar");

botonIngresar.addEventListener("click", function (e) {
    e.preventDefault();

    let usuario = document.getElementById("usuario").value;
    let contrasena = document.getElementById("contrasena").value;

    if (usuario !== "" && contrasena !== "") {

        localStorage.setItem("usuario", "1");
        window.location.href = "index.html";
    } else {
        alert("Por favor, completa todos los campos");
    }
});

