let projects = JSON.parse(localStorage.getItem("projects")) || {};

// Guardar en localStorage
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Poblar select de proyectos
function populateProjectSelect() {
  const select = document.getElementById("projectSelect");
  const filter = document.getElementById("filterProjects");
  select.innerHTML = `<option value="">-- Selecciona un proyecto existente --</option>`;
  filter.innerHTML = `<option value="all">Todos los proyectos</option>`;

  Object.keys(projects).forEach(p => {
    select.innerHTML += `<option value="${p}">${p}</option>`;
    filter.innerHTML += `<option value="${p}">${p}</option>`;
  });
}

// Renderizar proyectos
function renderProjects() {
  const projectList = document.getElementById("projectList");
  projectList.innerHTML = "";

  const filter = document.getElementById("filterProjects").value;

  Object.keys(projects).forEach(project => {
    if (filter !== "all" && filter !== project) return;

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

// Agregar caso
document.getElementById("addCaseBtn").addEventListener("click", () => {
  const newProject = document.getElementById("projectName").value.trim();
  const selectedProject = document.getElementById("projectSelect").value;
  const caseTitle = document.getElementById("caseTitle").value.trim();
  const caseDesc = document.getElementById("caseDescription").value.trim();

  if (!caseTitle || !caseDesc) {
    alert("Completa el título y la descripción.");
    return;
  }

  const projectKey = newProject || selectedProject;
  if (!projectKey) {
    alert("Debes ingresar un nuevo proyecto o seleccionar uno existente.");
    return;
  }

  if (!projects[projectKey]) projects[projectKey] = [];
  projects[projectKey].push({ title: caseTitle, description: caseDesc });

  saveProjects();
  renderProjects();
  populateProjectSelect();

  document.getElementById("projectName").value = "";
  document.getElementById("projectSelect").value = "";
  document.getElementById("caseTitle").value = "";
  document.getElementById("caseDescription").value = "";
});

// Editar caso
function editCase(project, index) {
  const c = projects[project][index];
  document.getElementById("projectSelect").value = project;
  document.getElementById("caseTitle").value = c.title;
  document.getElementById("caseDescription").value = c.description;

  projects[project].splice(index, 1);
  saveProjects();
  renderProjects();
}

// Eliminar caso
function deleteCase(project, index) {
  projects[project].splice(index, 1);
  if (projects[project].length === 0) delete projects[project];
  saveProjects();
  renderProjects();
  populateProjectSelect();
}

// Eliminar todo
document.getElementById("clearAllBtn").addEventListener("click", () => {
  if (confirm("¿Eliminar todos los proyectos?")) {
    projects = {};
    saveProjects();
    renderProjects();
    populateProjectSelect();
  }
});

// Exportar
document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "proyectos.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Importar
document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFile").click();
});
document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = event => {
    try {
      projects = JSON.parse(event.target.result);
      saveProjects();
      renderProjects();
      populateProjectSelect();
    } catch {
      alert("Archivo inválido");
    }
  };
  reader.readAsText(file);
});

// Filtros
document.getElementById("filterProjects").addEventListener("change", renderProjects);
document.getElementById("showAllBtn").addEventListener("click", () => {
  document.getElementById("filterProjects").value = "all";
  renderProjects();
});

// Inicial
populateProjectSelect();
renderProjects();









