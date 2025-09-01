// Obtener datos guardados en localStorage
let data = JSON.parse(localStorage.getItem("caseManagerData")) || {};

// Referencias a elementos HTML
const projectSelect = document.getElementById("projectSelect");
const caseTitle = document.getElementById("caseTitle");
const caseDescription = document.getElementById("caseDescription");
const addCaseBtn = document.getElementById("addCaseBtn");
const projectsAccordion = document.getElementById("projectsAccordion");

// Guardar en localStorage
function saveData() {
  localStorage.setItem("caseManagerData", JSON.stringify(data));
}

// Renderizar proyectos y casos
function renderProjects() {
  projectsAccordion.innerHTML = "";
  Object.entries(data).forEach(([project, cases], projectIndex) => {
    const projectId = `project-${projectIndex}`;
    const projectItem = document.createElement("div");
    projectItem.className = "accordion-item";

    projectItem.innerHTML = `
      <h2 class="accordion-header" id="heading-${projectId}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${projectId}">
          Proyecto: ${project}
        </button>
        <button class="btn btn-danger btn-sm ms-2" onclick="deleteProject('${project}')">🗑️</button>
      </h2>
      <div id="collapse-${projectId}" class="accordion-collapse collapse" data-bs-parent="#projectsAccordion">
        <div class="accordion-body">
          <div class="accordion" id="cases-${projectId}">
            ${cases.map((c, caseIndex) => `
              <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${projectId}-${caseIndex}">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${projectId}-${caseIndex}">
                    Caso: ${c.title}
                  </button>
                  <button class="btn btn-outline-danger btn-sm ms-2" onclick="deleteCase('${project}', ${caseIndex})">🗑️</button>
                </h2>
                <div id="collapse-${projectId}-${caseIndex}" class="accordion-collapse collapse" data-bs-parent="#cases-${projectId}">
                  <div class="accordion-body">
                    <pre style="white-space: pre-wrap;">${c.description}</pre>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
    projectsAccordion.appendChild(projectItem);
  });
  updateProjectSelect();
}

// Actualizar selector de proyectos
function updateProjectSelect() {
  projectSelect.innerHTML = `<option value="">Selecciona un proyecto</option>`;
  Object.keys(data).forEach(project => {
    const option = document.createElement("option");
    option.value = project;
    option.textContent = project;
    projectSelect.appendChild(option);
  });
}

// Agregar caso
addCaseBtn.addEventListener("click", () => {
  const project = projectSelect.value;
  const title = caseTitle.value.trim();
  const description = caseDescription.value.trim();

  if (!project || !title || !description) {
    alert("Completa todos los campos antes de agregar un caso");
    return;
  }

  if (!data[project]) data[project] = [];
  data[project].push({ title, description });
  saveData();
  renderProjects();

  caseTitle.value = "";
  caseDescription.value = "";
});

// Eliminar proyecto
function deleteProject(project) {
  if (confirm(`¿Seguro que quieres eliminar el proyecto "${project}"?`)) {
    delete data[project];
    saveData();
    renderProjects();
  }
}

// Eliminar caso
function deleteCase(project, caseIndex) {
  if (confirm("¿Seguro que quieres eliminar este caso?")) {
    data[project].splice(caseIndex, 1);
    saveData();
    renderProjects();
  }
}

// Borrar todo
function clearAll() {
  if (confirm("¿Seguro que quieres borrar todo?")) {
    data = {};
    saveData();
    renderProjects();
  }
}

// Exportar JSON
function exportJSON() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "proyectos.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Importar JSON
function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      data = JSON.parse(e.target.result);
      saveData();
      renderProjects();
    } catch {
      alert("Archivo JSON inválido");
    }
  };
  reader.readAsText(file);
}

// Inicializar
renderProjects();









