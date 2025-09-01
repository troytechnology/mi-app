let projects = JSON.parse(localStorage.getItem("projects")) || {};

// Guardar en localStorage
function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

// Renderizar lista de proyectos y casos
function renderProjects() {
    const container = document.getElementById("projectsList");
    container.innerHTML = "";

    Object.keys(projects).forEach((project, projectIndex) => {
        let projectId = project.replace(/\s+/g, "-");

        let casesHTML = projects[project]
            .map((c, caseIndex) => `
                <div class="accordion-item">
                    <h2 class="accordion-header d-flex align-items-center" id="heading-${projectId}-${caseIndex}">
                        <button class="accordion-button collapsed flex-grow-1" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${projectId}-${caseIndex}">
                            Caso: ${c.title}
                        </button>
                        <div class="ms-2">
                            <button class="btn btn-outline-primary btn-sm" onclick="editCase('${project}', ${caseIndex})">✏️</button>
                            <button class="btn btn-outline-danger btn-sm ms-1" onclick="deleteCase('${project}', ${caseIndex})">🗑️</button>
                        </div>
                    </h2>
                    <div id="collapse-${projectId}-${caseIndex}" class="accordion-collapse collapse">
                        <div class="accordion-body"><pre>${c.description}</pre></div>
                    </div>
                </div>
            `)
            .join("");

        container.innerHTML += `
            <div class="accordion mb-3">
                <h5>
                    Proyecto: ${project}
                    <button class="btn btn-outline-danger btn-sm ms-2" onclick="deleteProject('${project}')">🗑️</button>
                </h5>
                ${casesHTML || "<p class='text-muted'>Sin casos aún.</p>"}
            </div>
        `;
    });

    updateProjectDropdown();
}

// Actualizar selector de proyectos
function updateProjectDropdown() {
    const select = document.getElementById("projectSelect");
    select.innerHTML = `<option value="">Selecciona un proyecto</option>`;
    Object.keys(projects).forEach(project => {
        let opt = document.createElement("option");
        opt.value = project;
        opt.textContent = project;
        select.appendChild(opt);
    });
}

// Agregar proyecto
function addProject() {
    let name = prompt("Nombre del nuevo proyecto:");
    if (name && !projects[name]) {
        projects[name] = [];
        saveProjects();
        renderProjects();
    } else if (projects[name]) {
        alert("El proyecto ya existe.");
    }
}

// Agregar caso
document.getElementById("caseForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let project = document.getElementById("projectSelect").value;
    let title = document.getElementById("caseTitle").value.trim();
    let description = document.getElementById("caseDescription").value.trim();

    if (!project) return alert("Selecciona un proyecto");
    if (!title || !description) return alert("Completa todos los campos");

    projects[project].push({ title, description });
    saveProjects();
    renderProjects();

    this.reset();
});

// Editar caso
function editCase(project, index) {
    let caso = projects[project][index];

    let nuevoTitulo = prompt("Editar título:", caso.title);
    if (nuevoTitulo === null) return;

    let nuevaDescripcion = prompt("Editar descripción:", caso.description);
    if (nuevaDescripcion === null) return;

    projects[project][index] = {
        title: nuevoTitulo.trim(),
        description: nuevaDescripcion.trim()
    };

    saveProjects();
    renderProjects();
}

// Borrar caso
function deleteCase(project, index) {
    if (confirm("¿Seguro que deseas borrar este caso?")) {
        projects[project].splice(index, 1);
        saveProjects();
        renderProjects();
    }
}

// Borrar proyecto
function deleteProject(project) {
    if (confirm(`¿Seguro que deseas eliminar el proyecto "${project}" con todos sus casos?`)) {
        delete projects[project];
        saveProjects();
        renderProjects();
    }
}

// Borrar todo
function deleteAll() {
    if (confirm("¿Seguro que deseas borrar todos los proyectos y casos?")) {
        projects = {};
        saveProjects();
        renderProjects();
    }
}

// Exportar JSON
function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "proyectos.json");
    dlAnchor.click();
}

// Importar JSON
function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            projects = JSON.parse(e.target.result);
            saveProjects();
            renderProjects();
        } catch {
            alert("Archivo JSON inválido");
        }
    };
    reader.readAsText(file);
}

// Inicializar
renderProjects();











