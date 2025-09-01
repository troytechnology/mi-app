let data = JSON.parse(localStorage.getItem("projectsData")) || {};

const form = document.getElementById("caseForm");
const projectSelect = document.getElementById("projectSelect");
const newProjectDiv = document.getElementById("newProjectDiv");
const newProjectInput = document.getElementById("newProject");
const projectsAccordion = document.getElementById("projectsAccordion");

function updateProjectSelect() {
  projectSelect.innerHTML = `
    <option value="" disabled selected>Selecciona un proyecto</option>
    <option value="nuevo">+ Nuevo Proyecto</option>
  `;
  Object.keys(data).forEach(project => {
    const opt = document.createElement("option");
    opt.value = project;
    opt.textContent = project;
    projectSelect.appendChild(opt);
  });
}

function saveData() {
  localStorage.setItem("projectsData", JSON.stringify(data));
}

function deleteProject(projectName) {
  if (confirm(`¿Seguro que deseas eliminar el proyecto "${projectName}" y todos sus casos?`)) {
    delete data[projectName];
    saveData();
    updateProjectSelect();
    renderProjects();
  }
}

function deleteCase(projectName, caseIndex) {
  if (confirm(`¿Seguro que deseas eliminar este caso de "${projectName}"?`)) {
    data[projectName].splice(caseIndex, 1);
    if (data[projectName].length === 0) {
      delete data[projectName]; // Si ya no quedan casos, borra el proyecto
    }
    saveData();
    updateProjectSelect();
    renderProjects();
  }
}

function deleteAll() {
  if (confirm("⚠️ ¿Seguro que deseas eliminar TODOS los proyectos y casos? Esta acción no se puede deshacer.")) {
    data = {};
    saveData();
    updateProjectSelect();
    renderProjects();
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "casos_exportados.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (typeof importedData === "object") {
        data = importedData;
        saveData();
        updateProjectSelect();
        renderProjects();
        alert("✅ Datos importados con éxito.");
      } else {
        alert("⚠️ El archivo no tiene un formato válido.");
      }
    } catch (err) {
      alert("⚠️ Error al leer el archivo JSON.");
    }
  };
  reader.readAsText(file);
}

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
}

projectSelect.addEventListener("change", () => {
  if (projectSelect.value === "nuevo") {
    newProjectDiv.classList.remove("d-none");
    newProjectInput.focus();
  } else {
    newProjectDiv.classList.add("d-none");
    newProjectInput.value = "";
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let title = document.getElementById("title").value.trim() || "Sin título";
  let description = document.getElementById("description").value.trim() || "Sin descripción";
  let project = projectSelect.value;

  if (project === "nuevo") {
    project = newProjectInput.value.trim() || "Proyecto sin nombre";
    if (!data[project]) {
      data[project] = [];
    }
  }

  if (!data[project]) data[project] = [];
  data[project].push({ title, description });

  saveData();

  form.reset();
  newProjectDiv.classList.add("d-none");

  updateProjectSelect();
  renderProjects();
});

updateProjectSelect();
renderProjects();








