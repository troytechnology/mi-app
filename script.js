let projects = JSON.parse(localStorage.getItem("projects")) || {};

// Guardar en localStorage
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Renderizar proyectos y casos
function renderProjects() {
  const projectList = document.getElementById("projectList");
  projectList.innerHTML = "";

  const filter = document.getElementById("projectFilter").value || "all";

  Object.keys(projects).forEach((project, projIndex) => {
    if (filter !== "all" && filter !== project) return;

    const projectCard = document.createElement("div");
    projectCard.classList.add("card", "mb-3");

    const projectHeader = document.createElement("div");
    projectHeader.classList.add("card-header", "fw-bold");
    projectHeader.innerHTML = `Proyecto: ${project}`;
    projectCard.appendChild(projectHeader);

    const projectBody = document.createElement("div");
    projectBody.classList.add("card-body");

    const accordion = document.createElement("div");
    accordion.classList.add("accordion");
    accordion.id = `accordion-${projIndex}`;

    projects[project].forEach((c, i) => {
      const item = document.createElement("div");
      item.classList.add("accordion-item");

      item.innerHTML = `
        <h2 class="accordion-header" id="heading-${projIndex}-${i}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${projIndex}-${i}">
            Caso: ${c.title}
          </button>
        </h2>
        <div id="collapse-${projIndex}-${i}" class="accordion-collapse collapse" data-bs-parent="#accordion-${projIndex}">
          <div class="accordion-body case-description">
            ${c.description.replace(/\n/g, "<br>")}
            <div class="mt-2">
              <button class="btn btn-warning btn-sm me-1">Editar</button>
              <button class="btn btn-danger btn-sm">Eliminar</button>
            </div>
          </div>
        </div>
      `;

      accordion.appendChild(item);
    });

    projectBody.appendChild(accordion);
    projectCard.appendChild(projectBody);
    projectList.appendChild(projectCard);
  });
}

// Rellenar selects
function populateProjectSelect() {
  const select = document.getElementById("selectProject");
  const filter = document.getElementById("projectFilter");

  select.innerHTML = '<option value="">-- Selecciona un proyecto existente --</option>';
  filter.innerHTML = '<option value="all">Todos</option>';

  Object.keys(projects).forEach(p => {
    const opt1 = document.createElement("option");
    opt1.value = p;
    opt1.textContent = p;
    select.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = p;
    opt2.textContent = p;
    filter.appendChild(opt2);
  });
}

// Agregar caso
document.getElementById("addCase").addEventListener("click", () => {
  const newProjectName = document.getElementById("projectName").value.trim();
  const selectedProject = document.getElementById("selectProject").value;
  const caseTitle = document.getElementById("caseTitle").value.trim();
  const caseDesc = document.getElementById("caseDescription").value.trim();

  if (!caseTitle || !caseDesc) {
    alert("Por favor completa todos los campos del caso.");
    return;
  }

  let projectKey = newProjectName || selectedProject;
  if (!projectKey) {
    alert("Debes ingresar un nuevo proyecto o seleccionar uno existente.");
    return;
  }

  if (!projects[projectKey]) projects[projectKey] = [];
  projects[projectKey].push({ title: caseTitle, description: caseDesc });

  saveProjects();
  renderProjects();
  populateProjectSelect();

  document.getElementById("caseTitle").value = "";
  document.getElementById("caseDescription").value = "";
  document.getElementById("projectName").value = "";
  document.getElementById("selectProject").value = "";
});

// Importar JSON
document.getElementById("importJSON").addEventListener("click", () => {
  document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      projects = imported;
      saveProjects();
      renderProjects();
      populateProjectSelect();
      alert("✅ JSON importado correctamente");
    } catch (err) {
      alert("Archivo inválido: " + err.message);
    }
  };
  reader.readAsText(file);
});

// Exportar JSON
document.getElementById("exportJSON").addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "projects.json");
  dlAnchor.click();
});

// Eliminar todo
document.getElementById("deleteAll").addEventListener("click", () => {
  if (confirm("¿Seguro que deseas eliminar todo?")) {
    projects = {};
    saveProjects();
    renderProjects();
    populateProjectSelect();
  }
});

// Ver todos
document.getElementById("viewAll").addEventListener("click", () => {
  document.getElementById("projectFilter").value = "all";
  renderProjects();
});

// Cambio de filtro
document.getElementById("projectFilter").addEventListener("change", renderProjects);

// Inicializar
populateProjectSelect();
renderProjects();












