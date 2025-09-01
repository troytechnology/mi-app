// script.js

// Obtener casos guardados desde LocalStorage
function obtenerCasos() {
    return JSON.parse(localStorage.getItem("casos")) || [];
}

// Guardar casos en LocalStorage
function guardarCasos(casos) {
    localStorage.setItem("casos", JSON.stringify(casos));
}

// Renderizar la tabla de casos
function renderizarCasos() {
    const casos = obtenerCasos();
    const tbody = document.querySelector("#tabla-casos tbody");
    tbody.innerHTML = "";

    casos.forEach((caso, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${caso.titulo}</td>
            <td>${caso.estado}</td>
            <td><pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${caso.descripcion}</pre></td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="eliminarCaso(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}

// Agregar un caso nuevo
document.querySelector("#form-casos").addEventListener("submit", function (e) {
    e.preventDefault();

    const titulo = document.querySelector("#titulo").value;
    const estado = document.querySelector("#estado").value;
    const descripcion = document.querySelector("#descripcion").value;

    const casos = obtenerCasos();
    casos.push({ titulo, estado, descripcion });
    guardarCasos(casos);

    this.reset();
    renderizarCasos();
});

// Eliminar caso por índice
function eliminarCaso(index) {
    const casos = obtenerCasos();
    casos.splice(index, 1);
    guardarCasos(casos);
    renderizarCasos();
}

// Render inicial al cargar la página
document.addEventListener("DOMContentLoaded", renderizarCasos);

