// Cargar proyectos desde localStorage o iniciar vacío
let projects = JSON.parse(localStorage.getItem("projects")) || [];

const projectList = document.getElementById("projectList");
const selectProject = document.getElementById("selectProject");
const projectFilter = document.getElementById("projectFilter");

// Guardar en localStorage
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Formatear descripción (para mantener saltos de línea)
function formatDescription(text) {
  return text.replace(/\n/g, "<br>");
}

// Renderizar proyectos con filtro opcional
function renderProjects(selectedProject = projectFilter.value) {
  projectList.innerHTML = "";
  projectFilter.innerHTML = '<option value="">Todos los proyectos</option>';
  selectProject.innerHTML = '<option value="">-- Selecciona un proyecto existente --</option>';

  projects.forEach((project, projIndex) => {
    // Agregar opción a los selects
    const option = document.createElement("option");
    option.value = project.name;
    option.textContent = project.name;
    projectFilter.appendChild(option);

    const option2 = option.cloneNode(true);
    selectProject.appendChild(option2);

    // ✅ Mostrar solo el proyecto seleccionado
    if (selectedProject && selectedProject !== project.name) return;

    // Crear tarjeta del proyecto
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
          <div class="accordion-body case-description">
            ${formatDescription(c.description)}
            <div class="mt-2">
              <button class="btn btn-warning btn-sm me-1">Editar</button>
              <button class="btn btn-danger btn-sm">Eliminar</button>
            </div>
          </div>
        </div>
      `;

      // Botón eliminar caso
      item.querySelector(".btn-danger").addEventListener("click", () => {
        project.cases.splice(i, 1);
        saveProjects();
        renderProjects(selectedProject);
      });

      accordion.appendChild(item);
    });

    card.appendChild(accordion);
    projectList.appendChild(card);
  });

  // Mantener la selección activa
  projectFilter.value = selectedProject || "";
}

// Llenar select de proyectos
function populateProjectSelect() {
  selectProject.innerHTML = '<option value="">-- Selecciona un proyecto existente --</option>';
  projects.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = p.name;
    selectProject.appendChild(opt);
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

// 🔍 Filtrar por proyecto
projectFilter.addEventListener("change", () => {
  renderProjects(projectFilter.value);
});

// 🚀 Inicializar
populateProjectSelect();
renderProjects();











