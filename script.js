let projects = JSON.parse(localStorage.getItem("projects")) || [];

const projectNameInput = document.getElementById("projectName");
const caseTitleInput = document.getElementById("caseTitle");
const caseDescriptionInput = document.getElementById("caseDescription");
const projectList = document.getElementById("projectList");
const projectFilter = document.getElementById("projectFilter");

document.getElementById("addCase").addEventListener("click", addCase);
document.getElementById("deleteAll").addEventListener("click", deleteAll);
document.getElementById("exportJSON").addEventListener("click", exportJSON);
document.getElementById("importJSON").addEventListener("click", () => document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", importJSON);
document.getElementById("viewAll").addEventListener("click", renderProjects);

function addCase() {
  const projectName = projectNameInput.value.trim();
  const caseTitle = caseTitleInput.value.trim();
  const caseDescription = caseDescriptionInput.value.trim();

  if (!projectName || !caseTitle || !caseDescription) return alert("Completa todos los campos");

  let project = projects.find(p => p.name === projectName);
  if (!project) {
    project = { name: projectName, cases: [] };
    projects.push(project);
  }

  project.cases.push({ title: caseTitle, description: caseDescription });
  saveProjects();
  clearInputs();
  renderProjects();
}

function deleteAll() {
  if (confirm("¿Seguro que deseas eliminar todos los proyectos?")) {
    projects = [];
    saveProjects();
    renderProjects();
  }
}

function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "projects.json");
  dlAnchor.click();
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      projects = JSON.parse(e.target.result);
      saveProjects();
      renderProjects();
    } catch {
      alert("Archivo inválido");
    }
  };
  reader.readAsText(file);
}

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function clearInputs() {
  projectNameInput.value = "";
  caseTitleInput.value = "";
  caseDescriptionInput.value = "";
}

function renderProjects() {
  projectList.innerHTML = "";
  projectFilter.innerHTML = '<option value="">Todos los proyectos</option>';

  projects.forEach(project => {
    const option = document.createElement("option");
    option.value = project.name;
    option.textContent = project.name;
    projectFilter.appendChild(option);

    if (projectFilter.value && projectFilter.value !== project.name) return;

    const card = document.createElement("div");
    card.className = "card p-3";
    card.innerHTML = `<h5>Proyecto: ${project.name}</h5>`;

    project.cases.forEach((c, i) => {
      const caseDiv = document.createElement("div");
      caseDiv.className = "mt-2";
      caseDiv.innerHTML = `
        <strong>${c.title}:</strong> ${c.description}
        <div class="mt-1">
          <button class="btn btn-warning btn-sm me-1">Editar</button>
          <button class="btn btn-danger btn-sm">Eliminar</button>
        </div>
      `;
      caseDiv.querySelector(".btn-danger").addEventListener("click", () => {
        project.cases.splice(i, 1);
        saveProjects();
        renderProjects();
      });
      card.appendChild(caseDiv);
    });

    projectList.appendChild(card);
  });
}

// Render inicial
renderProjects();










