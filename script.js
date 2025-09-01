let projects = JSON.parse(localStorage.getItem("projects")) || {};

// Guardar en localStorage
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Actualizar dropdowns
function updateProjectDropdown() {
  const select = document.getElementById("existingProject");
  const filter = document.getElementById("projectFilter");

  select.innerHTML = `<option value="">-- Selecciona un proyecto existente --</option>`;
  filter.innerHTML = `<option value="all">Todos los proyectos</option>`;

  Object.keys(projects).forEach(proj => {
    const opt1 = document.createElement("option");
    opt1.value = proj;
    opt1.textContent = proj;
    select.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = proj;
    opt2.textContent = proj;
    filter.appendChild(opt2);
  });
}

// Renderizar proyectos
function renderProjects(filter = "all") {
  const container = document.getElementById("projectList");
  container.innerHTML = "";

  Object.keys(projects).forEach(proj => {
    if (filter !== "all" && proj !== filter) return;

    const projCard = document.createElement("div");
    projCard.className = "project-card";
    projCard.innerHTML = `<h5>Proyecto: ${proj} 
        <button class="btn btn-sm btn-danger float-end" onclick="deleteProject('${proj}')">🗑</button>
      </h5>`;

    projects[proj].forEach((caso, index) => {
      const caseDiv = document.createElement("div");
      caseDiv.className = "case-card";

      caseDiv.innerHTML = `
        <div class="case-header" onclick="toggleCase(this)">
          <strong>${caso.title}</strong>
          <div>
            <button class="btn btn-warning btn-sm" onclick="editCase('${proj}', ${index})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCase('${proj}', ${index})">Eliminar</button>
          </div>
        </div>
        <div class="case-body"><p>${caso.description}</p></div>
      `;

      projCard.appendChild(caseDiv);
    });

    container.appendChild(projCard);
  });
}

// Toggle case desplegable
function toggleCase(el) {
  const body = el.nextElementSibling;
  body.style.display = body.style.display === "block" ? "none" : "block";
}

// Agregar caso
document.getElementById("addCase").addEventListener("click", () => {
  const newProj = document.getElementById("projectName").value.trim();
  const existingProj = document.getElementById("existingProject").value;
  const caseTitle = document.getElementById("caseTitle").value.trim();
  const caseDescription = document.getElementById("caseDescription").value.trim();

  if (!caseTitle || !caseDescription) {
    alert("Completa título y descripción");
    return;
  }

  const proj = newProj || existingProj;
  if (!proj) {
    alert("Debes seleccionar o crear un proyecto");
    return;
  }

  if (!projects[proj]) projects[proj] = [];
  projects[proj].push({ title: caseTitle, description: caseDescription });

  saveProjects();
  updateProjectDropdown();
  renderProjects();

  document.getElementById("projectName").value = "";
  document.getElementById("caseTitle").value = "";
  document.getElementById("caseDescription").value = "";
});

// Eliminar todo
document.getElementById("deleteAll").addEventListener("click", () => {
  if (confirm("¿Seguro que quieres eliminar todo?")) {
    projects = {};
    saveProjects();
    updateProjectDropdown();
    renderProjects();
  }
});

// Eliminar proyecto
function deleteProject(proj) {
  if (confirm(`¿Eliminar proyecto ${proj}?`)) {
    delete projects[proj];
    saveProjects();
    updateProjectDropdown();
    renderProjects();
  }
}

// Eliminar caso
function deleteCase(proj, index) {
  projects[proj].splice(index, 1);
  if (projects[proj].length === 0) delete projects[proj];
  saveProjects();
  updateProjectDropdown();
  renderProjects();
}

// Editar caso
function editCase(proj, index) {
  const caso = projects[proj][index];
  document.getElementById("projectName").value = proj;
  document.getElementById("caseTitle").value = caso.title;
  document.getElementById("caseDescription").value = caso.description;

  projects[proj].splice(index, 1); // Lo quito temporalmente
  saveProjects();
  renderProjects();
}

// Exportar JSON
document.getElementById("exportJSON").addEventListener("click", () => {
  const data = JSON.stringify(projects, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "proyectos.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Importar JSON
document.getElementById("importJSON").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (typeof imported !== "object" || Array.isArray(imported)) {
        throw new Error("Formato inválido");
      }

      projects = imported;
      saveProjects();
      updateProjectDropdown();
      renderProjects();

      alert("✅ JSON importado correctamente");
    } catch (err) {
      alert("Archivo inválido: " + err.message);
    }
  };
  reader.readAsText(file);
});

// Filtro de proyectos
document.getElementById("projectFilter").addEventListener("change", (e) => {
  renderProjects(e.target.value);
});

// Botón "Ver todos"
document.getElementById("showAll").addEventListener("click", () => {
  document.getElementById("projectFilter").value = "all";
  renderProjects();
});

// Inicializar
updateProjectDropdown();
renderProjects();

