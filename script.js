let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Guardar en LocalStorage
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Renderizar proyectos
function renderProjects(filter = "Todos") {
  const projectList = document.getElementById("projectList");
  projectList.innerHTML = "";

  let filtered = filter === "Todos" ? projects : projects.filter(p => p.name === filter);

  filtered.forEach((project, pIndex) => {
    const projectCard = document.createElement("div");
    projectCard.classList.add("card", "mb-3");

    const projectHeader = document.createElement("div");
    projectHeader.classList.add("card-header", "fw-bold");
    projectHeader.textContent = `Proyecto: ${project.name}`;
    projectCard.appendChild(projectHeader);

    const projectBody = document.createElement("div");
    projectBody.classList.add("card-body");

    project.cases.forEach((c, cIndex) => {
      const accordion = document.createElement("div");
      accordion.classList.add("accordion", "mb-2");

      accordion.innerHTML = `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading-${pIndex}-${cIndex}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${pIndex}-${cIndex}">
              Caso: ${c.title}
            </button>
          </h2>
          <div id="collapse-${pIndex}-${cIndex}" class="accordion-collapse collapse">
            <div class="accordion-body">
              ${c.description}
              <div class="mt-2">
                <button class="btn btn-warning btn-sm">Editar</button>
                <button class="btn btn-danger btn-sm">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      `;
      projectBody.appendChild(accordion);
    });

    projectCard.appendChild(projectBody);
    projectList.appendChild(projectCard);
  });
}

// Llenar select de proyectos
function populateProjectSelect() {
  const select = document.getElementById("selectProject");
  const filter = document.getElementById("projectFilter");

  select.innerHTML = '<option value="">-- Selecciona un proyecto existente --</option>';
  filter.innerHTML = '<option value="Todos">Todos</option>';

  projects.forEach(p => {
    const opt1 = document.createElement("option");
    opt1.value = p.name;
    opt1.textContent = p.name;
    select.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = p.name;
    opt2.textContent = p.name;
    filter.appendChild(opt2);
  });
}

// ➕ Agregar caso
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

  let projectObj = projects.find(p => p.name === projectKey);
  if (!projectObj) {
    projectObj = { name: projectKey, cases: [] };
    projects.push(projectObj);
  }

  projectObj.cases.push({ title: caseTitle, description: caseDesc });
  saveProjects();
  renderProjects();
  populateProjectSelect();

  document.getElementById("projectName").value = "";
  document.getElementById("selectProject").value = "";
  document.getElementById("caseTitle").value = "";
  document.getElementById("caseDescription").value = "";
});

// 📤 Exportar JSON
document.getElementById("exportJSON").addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "projects.json");
  dlAnchor.click();
});

// 📥 Importar JSON
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
      if (Array.isArray(imported)) {
        projects = imported;
      } else {
        projects = Object.keys(imported).map(name => ({
          name,
          cases: imported[name]
        }));
      }
      saveProjects();
      renderProjects();
      populateProjectSelect();
    } catch (err) {
      alert("Archivo inválido: " + err.message);
    }
  };
  reader.readAsText(file);
});

// 🗑 Eliminar todo
document.getElementById("deleteAll").addEventListener("click", () => {
  if (confirm("¿Seguro que deseas eliminar todo?")) {
    projects = [];
    saveProjects();
    renderProjects();
    populateProjectSelect();
  }
});

// 🔍 Filtro
document.getElementById("projectFilter").addEventListener("change", (e) => {
  renderProjects(e.target.value);
});
document.getElementById("viewAll").addEventListener("click", () => {
  document.getElementById("projectFilter").value = "Todos";
  renderProjects();
});

// 🚀 Inicializar
populateProjectSelect();
renderProjects();









