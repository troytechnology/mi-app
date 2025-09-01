let projects = JSON.parse(localStorage.getItem("projects")) || {};

// Guardar en localStorage
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Renderizar proyectos
function renderProjects() {
  const projectList = document.getElementById("projectList");
  projectList.innerHTML = "";

  const filter = document.getElementById("filterProjects").value;

  // Filtrar proyectos
  let projectsToShow = Object.keys(projects);
  if (filter !== "all") {
    projectsToShow = projectsToShow.filter(p => p === filter);
  }

  // Mostrar cada proyecto
  projectsToShow.forEach(project => {
    const card = document.createElement("div");
    card.classList.add("card", "mb-3");

    const header = document.createElement("div");
    header.classList.add("card-header", "fw-bold");
    header.textContent = `Proyecto: ${project}`;
    card.appendChild(header);

    const body = document.createElement("div");
    body.classList.add("card-body");

    const accordion = document.createElement("div");
    accordion.classList.add("accordion");
    accordion.id = `accordion-${project}`;

    projects[project].forEach((c, index) => {
      const item = document.createElement("div");
      item.classList.add("accordion-item");

      item.innerHTML = `
        <h2 class="accordion-header" id="heading-${project}-${index}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${project}-${index}">
            Caso: ${c.title}
          </button>
        </h2>
        <div id="collapse-${project}-${index}" class="accordion-collapse collapse" data-bs-parent="#accordion-${project}">
          <div class="accordion-body">
            ${c.description}
            <div class="mt-2">
              <button class="btn btn-warning btn-sm" onclick="editCase('${project}', ${index})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="deleteCase('${project}', ${index})">Eliminar</button>
            </div>
          </div>
        </div>
      `;

      accordion.appendChild(item);
    });

    body.appendChild(accordion);
    card.appendChild(body);
    projectList.appendChild(card);
  });
}

// Agregar caso o proyecto
document.getElementById("addCase").addEventListener("click", () => {
  const newProject = document.getElementById("projectName").value.trim();
  const existingProject = document.getElementById("existingProject").value;
  const title = document.getElementById("caseTitle").value.trim();
  const description = document.getElementById("caseDescription").value.trim();

  if ((!newProject && existingProject === "") || !title || !description) {
    alert("Por favor completa todos los campos");
    return;
  }

  const project = newProject || existingProject;

  if (!projects[project]) {
    projects[project] = [];
  }

  projects[project].push({ title, description });

  saveProjects();
  populateProjectSelect();
  renderProjects();

  document.getElementById("projectName").value = "";
  document.getElementById("existingProject").value = "";
  document.getElementById("caseTitle").value = "";
  document.getElementById("caseDescription").value = "";
});

// Editar caso
function editCase(project, index) {
  const caseData = projects[project][index];
  document.getElementById("projectName").value = project;
  document.getElementById("caseTitle").value = caseData.title;
  document.getElementById("caseDescription").value = caseData.description;

  deleteCase(project, index);
}

// Eliminar caso
function deleteCase(project, index) {
  projects[project].splice(index, 1);
  if (projects[project].length === 0) {
    delete projects[project];
  }
  saveProjects();
  populateProjectSelect();
  renderProjects();
}

// Eliminar todo
document.getElementById("clearAll").addEventListener("click", () => {
  if (confirm("¿Seguro que deseas eliminar todo?")) {
    projects = {};
    saveProjects();
    populateProjectSelect();
    renderProjects();
  }
});

// Exportar JSON
document.getElementById("exportJSON").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "proyectos.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Importar JSON
document.getElementById("importJSON").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      projects = JSON.parse(e.target.result);
      saveProjects();
      populateProjectSelect();
      renderProjects();
    } catch {
      alert("Archivo inválido");
    }
  };
  reader.readAsText(file);
});

// Poblar selects
function populateProjectSelect() {
  const existingProject = document.getElementById("existingProject");
  const filterProjects = document.getElementById("filterProjects");

  existingProject.innerHTML = '<option value="">-- Selecciona un proyecto existente --</option>';
  filterProjects.innerHTML = '<option value="all">Todos los proyectos</option>';

  Object.keys(projects).forEach(p => {
    const opt1 = document.createElement("option");
    opt1.value = p;
    opt1.textContent = p;
    existingProject.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = p;
    opt2.textContent = p;
    filterProjects.appendChild(opt2);
  });
}

// Filtro dinámico
document.getElementById("filterProjects").addEventListener("change", renderProjects);

// Botón "Ver todos"
document.getElementById("showAll").addEventListener("click", () => {
  document.getElementById("filterProjects").value = "all";
  renderProjects();
});

// Inicializar
populateProjectSelect();
renderProjects();










