let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Guardar en localStorage
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Renderizar proyectos
function renderProjects(filter = "Todos") {
  const container = document.getElementById("projectList");
  container.innerHTML = "";

  let filteredProjects = filter === "Todos" ? projects : projects.filter(p => p.name === filter);

  filteredProjects.forEach((projectObj, projectIndex) => {
    const projectCard = document.createElement("div");
    projectCard.classList.add("card", "mb-3");

    const projectHeader = document.createElement("div");
    projectHeader.classList.add("card-header", "fw-bold", "d-flex", "justify-content-between");
    projectHeader.innerHTML = `
      <span>Proyecto: ${projectObj.name}</span>
      <button class="btn btn-danger btn-sm delete-project" data-index="${projectIndex}">Eliminar Proyecto</button>
    `;
    projectCard.appendChild(projectHeader);

    const projectBody = document.createElement("div");
    projectBody.classList.add("card-body");

    if (Array.isArray(projectObj.cases)) {
      projectObj.cases.forEach((caso, caseIndex) => {
        const accordion = document.createElement("div");
        accordion.classList.add("accordion", "mb-2");

        accordion.innerHTML = `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading-${projectIndex}-${caseIndex}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${projectIndex}-${caseIndex}">
                Caso: ${caso.title}
              </button>
            </h2>
            <div id="collapse-${projectIndex}-${caseIndex}" class="accordion-collapse collapse">
              <div class="accordion-body">
                ${caso.description}
                <div class="mt-2">
                  <button class="btn btn-warning btn-sm edit-case" data-project="${projectIndex}" data-case="${caseIndex}">Editar</button>
                  <button class="btn btn-danger btn-sm delete-case" data-project="${projectIndex}" data-case="${caseIndex}">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        `;
        projectBody.appendChild(accordion);
      });
    }

    projectCard.appendChild(projectBody);
    container.appendChild(projectCard);
  });

  addEventListeners();
}

// Rellenar select de proyectos
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

  let projectObj = projects.find(p => p.name === projectKey);
  if (!projectObj) {
    projectObj = { name: projectKey, cases: [] };
    projects.push(projectObj);
  }

  projectObj.cases.push({ title: caseTitle, description: caseDesc });

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

      // 🔹 Asegurar formato array
      if (Array.isArray(imported)) {
        projects = imported;
      } else {
        // Convertir de objeto viejo {Proyecto: [casos]} → [{name, cases}]
        projects = Object.keys(imported).map(name => ({
          name,
          cases: imported[name]
        }));
      }

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
    projects = [];
    saveProjects();
    renderProjects();
    populateProjectSelect();
  }
});

// Ver todos
document.getElementById("viewAll").addEventListener("click", () => {
  document.getElementById("projectFilter").value = "Todos";
  renderProjects();
});

// Cambio de filtro
document.getElementById("projectFilter").addEventListener("change", (e) => {
  renderProjects(e.target.value);
});

// Editar / Eliminar casos y proyectos
function addEventListeners() {
  document.querySelectorAll(".delete-case").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const pIndex = e.target.getAttribute("data-project");
      const cIndex = e.target.getAttribute("data-case");
      if (confirm("¿Eliminar este caso?")) {
        projects[pIndex].cases.splice(cIndex, 1);
        saveProjects();
        renderProjects();
      }
    });
  });

  document.querySelectorAll(".edit-case").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const pIndex = e.target.getAttribute("data-project");
      const cIndex = e.target.getAttribute("data-case");
      const caso = projects[pIndex].cases[cIndex];

      document.getElementById("projectName").value = projects[pIndex].name;
      document.getElementById("caseTitle").value = caso.title;
      document.getElementById("caseDescription").value = caso.description;

      // eliminar temporalmente y luego volver a guardar como editado
      projects[pIndex].cases.splice(cIndex, 1);
      saveProjects();
      renderProjects();
    });
  });

  document.querySelectorAll(".delete-project").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      if (confirm("¿Eliminar este proyecto completo?")) {
        projects.splice(index, 1);
        saveProjects();
        renderProjects();
        populateProjectSelect();
      }
    });
  });
}

// Inicializar
populateProjectSelect();
renderProjects();






