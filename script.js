let projects = JSON.parse(localStorage.getItem("projects")) || {};

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function renderProjects(filter = "all") {
  const list = document.getElementById("projectsList");
  list.innerHTML = "";

  Object.keys(projects).forEach(project => {
    if (filter !== "all" && filter !== project) return;

    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");
    projectDiv.innerHTML = `
      <h3>Proyecto: ${project} 
        <button onclick="deleteProject('${project}')">🗑️</button>
      </h3>
    `;

    projects[project].forEach((c, index) => {
      const caseDiv = document.createElement("div");
      caseDiv.classList.add("case");
      caseDiv.innerHTML = `
        <p><strong>${c.title}</strong>: ${c.description}</p>
        <button onclick="editCase('${project}', ${index})">✏️ Editar</button>
        <button onclick="deleteCase('${project}', ${index})">🗑️ Eliminar</button>
      `;
      projectDiv.appendChild(caseDiv);
    });

    list.appendChild(projectDiv);
  });
}

function addCase() {
  const projectName = document.getElementById("projectName").value.trim();
  const caseTitle = document.getElementById("caseTitle").value.trim();
  const caseDescription = document.getElementById("caseDescription").value.trim();

  if (!projectName || !caseTitle) return alert("Proyecto y título son obligatorios");

  if (!projects[projectName]) projects[projectName] = [];
  projects[projectName].push({ title: caseTitle, description: caseDescription });

  saveProjects();
  updateProjectFilter();
  renderProjects(document.getElementById("projectFilter").value);

  document.getElementById("caseTitle").value = "";
  document.getElementById("caseDescription").value = "";
}

function deleteCase(project, index) {
  projects[project].splice(index, 1);
  if (projects[project].length === 0) delete projects[project];
  saveProjects();
  updateProjectFilter();
  renderProjects(document.getElementById("projectFilter").value);
}

function editCase(project, index) {
  const c = projects[project][index];
  document.getElementById("projectName").value = project;
  document.getElementById("caseTitle").value = c.title;
  document.getElementById("caseDescription").value = c.description;

  deleteCase(project, index);
}

function deleteProject(project) {
  if (confirm(`¿Eliminar el proyecto "${project}" completo?`)) {
    delete projects[project];
    saveProjects();
    updateProjectFilter();
    renderProjects(document.getElementById("projectFilter").value);
  }
}

function clearAll() {
  if (confirm("¿Seguro que deseas eliminar todo?")) {
    projects = {};
    saveProjects();
    renderProjects();
    updateProjectFilter();
  }
}

function updateProjectFilter() {
  const filter = document.getElementById("projectFilter");
  filter.innerHTML = `<option value="all">Todos los proyectos</option>`;
  Object.keys(projects).forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    filter.appendChild(option);
  });
}

function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "proyectos.json");
  dlAnchor.click();
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      projects = JSON.parse(e.target.result);
      saveProjects();
      updateProjectFilter();
      renderProjects();
    } catch (err) {
      alert("Archivo JSON inválido");
    }
  };
  reader.readAsText(file);
}

// Eventos
document.getElementById("addCaseBtn").addEventListener("click", addCase);
document.getElementById("clearAllBtn").addEventListener("click", clearAll);
document.getElementById("exportBtn").addEventListener("click", exportJSON);
document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importInput").click());
document.getElementById("importInput").addEventListener("change", importJSON);
document.getElementById("projectFilter").addEventListener("change", e => renderProjects(e.target.value));
document.getElementById("showAllBtn").addEventListener("click", () => renderProjects("all"));

// Inicializar
updateProjectFilter();
renderProjects();









