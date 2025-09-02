// Elementos
const newProjectInput = document.getElementById("newProject");
const existingProjectSelect = document.getElementById("existingProject");
const caseTitleInput = document.getElementById("caseTitle");
const caseDescriptionInput = document.getElementById("caseDescription");
const addCaseBtn = document.getElementById("addCase");
const clearAllBtn = document.getElementById("clearAll");
const exportJSONBtn = document.getElementById("exportJSON");
const importJSONBtn = document.getElementById("importBtn");
const importFileInput = document.getElementById("importJSON");
const projectList = document.getElementById("projectList");
const projectFilter = document.getElementById("projectFilter");

// Data
let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Guardar
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Renderizar proyectos
function renderProjects() {
  projectList.innerHTML = "";

  const filter = projectFilter.value;
  let filteredProjects = filter ? projects.filter(p => p.name === filter) : projects;

  filteredProjects.forEach((project, projIndex) => {
    const card = document.createElement("div");
    card.className = "card p-3 mb-3";
    card.innerHTML = `<h5>Proyecto: ${project.name}</h5>`;

    const accordion = document.createElement("div");
    accordion.className = "accordion";
    accordion.id = `accordion-${projIndex}`;

    project.cases.forEach((c, i) => {
      const item = document.createElement("div");
      item.className = "accordion-item";
      item.innerHTML = `
        <h2 class="accordion-header" id="heading-${projIndex}-${i}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${projIndex}-${i}">
            ${c.title}
          </button>
        </h2>
        <div id="collapse-${projIndex}-${i}" class="accordion-collapse collapse" data-bs-parent="#accordion-${projIndex}">
          <div class="accordion-body" style="white-space: pre-line;">
            ${c.description}
          </div>
        </div>
      `;
      accordion.appendChild(item);
    });

    card.appendChild(accordion);
    projectList.appendChild(card);
  });

  // Actualizar selectores
  updateProjectSelectors();
}

// Actualizar selects
function updateProjectSelectors() {
  [existingProjectSelect, projectFilter].forEach(select => {
    const currentValue = select.value;
    select.innerHTML = `<option value="">${select === projectFilter ? "Todos los proyectos" : "-- Selecciona un proyecto existente --"}</option>`;
    projects.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = p.name;
      if (p.name === currentValue) opt.selected = true;
      select.appendChild(opt);
    });
  });
}

// Agregar caso
addCaseBtn.addEventListener("click", () => {
  const newProject = newProjectInput.value.trim();
  const existingProject = existingProjectSelect.value;
  const caseTitle = caseTitleInput.value.trim();
  const caseDescription = caseDescriptionInput.value.trim();

  if ((!newProject && !existingProject) || !caseTitle || !caseDescription) {
    alert("Completa todos los campos");
    return;
  }

  let project = projects.find(p => p.name === (newProject || existingProject));
  if (!project) {
    project = { name: newProject, cases: [] };
    projects.push(project);
  }

  project.cases.push({ title: caseTitle, description: caseDescription });
  saveProjects();
  renderProjects();

  newProjectInput.value = "";
  existingProjectSelect.value = "";
  caseTitleInput.value = "";
  caseDescriptionInput.value = "";
});

// Eliminar todo
clearAllBtn.addEventListener("click", () => {
  if (confirm("¿Seguro que quieres eliminar todo?")) {
    projects = [];
    saveProjects();
    renderProjects();
  }
});

// Exportar
exportJSONBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "projects.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Importar
importJSONBtn.addEventListener("click", () => importFileInput.click());

importFileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        projects = data;
        saveProjects();
        renderProjects();
      } else {
        alert("Archivo inválido");
      }
    } catch {
      alert("Error al leer el archivo");
    }
  };
  reader.readAsText(file);
});

// Filtrar
projectFilter.addEventListener("change", renderProjects);

// Inicializar
renderProjects();











