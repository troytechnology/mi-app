let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Guardar en localStorage
function saveData() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Renderizar proyectos
function renderProjects() {
  const list = document.getElementById("projectsList");
  const select = document.getElementById("projectSelect");

  list.innerHTML = "";
  select.innerHTML = "";

  projects.forEach((project, pIndex) => {
    // Opción en el select
    const option = document.createElement("option");
    option.value = pIndex;
    option.textContent = project.name;
    select.appendChild(option);

    // Card de proyecto
    const projectCard = document.createElement("div");
    projectCard.className = "card mb-3";
    projectCard.innerHTML = `
      <div class="card-header d-flex justify-content-between align-items-center">
        <strong>Proyecto: ${project.name}</strong>
        <button class="btn btn-sm btn-danger" onclick="deleteProject(${pIndex})">🗑️</button>
      </div>
      <div class="card-body">
        ${project.cases.map((c, cIndex) => `
          <div class="card mb-2">
            <div class="card-body">
              <h5 class="card-title">Caso: ${c.title}</h5>
              <p class="card-text">${c.description}</p>
              <button class="btn btn-sm btn-warning" onclick="editCase(${pIndex}, ${cIndex})">✏️ Editar</button>
              <button class="btn btn-sm btn-danger" onclick="deleteCase(${pIndex}, ${cIndex})">🗑️ Borrar</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    list.appendChild(projectCard);
  });
}

// Agregar proyecto
function addProject() {
  const name = prompt("Nombre del nuevo proyecto:");
  if (name) {
    projects.push({ name, cases: [] });
    saveData();
    renderProjects();
  }
}

// Agregar caso
document.getElementById("caseForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const pIndex = document.getElementById("projectSelect").value;
  const title = document.getElementById("caseTitle").value;
  const description = document.getElementById("caseDescription").value;

  if (pIndex === "" || title.trim() === "") {
    alert("Debes seleccionar un proyecto y escribir un título.");
    return;
  }

  projects[pIndex].cases.push({ title, description });
  saveData();
  renderProjects();
  e.target.reset();
});

// Editar caso
function editCase(pIndex, cIndex) {
  const caseData = projects[pIndex].cases[cIndex];
  const newTitle = prompt("Nuevo título:", caseData.title);
  const newDescription = prompt("Nueva descripción:", caseData.description);

  if (newTitle !== null && newDescription !== null) {
    projects[pIndex].cases[cIndex] = { title: newTitle, description: newDescription };
    saveData();
    renderProjects();
  }
}

// Borrar caso
function deleteCase(pIndex, cIndex) {
  projects[pIndex].cases.splice(cIndex, 1);
  saveData();
  renderProjects();
}

// Borrar proyecto
function deleteProject(pIndex) {
  projects.splice(pIndex, 1);
  saveData();
  renderProjects();
}

// Borrar todo
function deleteAll() {
  if (confirm("¿Seguro que deseas borrar todo?")) {
    projects = [];
    saveData();
    renderProjects();
  }
}

// Exportar
function exportJSON() {
  const data = JSON.stringify(projects, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "proyectos.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Importar
function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      projects = JSON.parse(e.target.result);
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












