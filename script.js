let projects = JSON.parse(localStorage.getItem("projects")) || [];

const projectNameInput = document.getElementById("projectName");
const selectProject = document.getElementById("selectProject");
const caseTitleInput = document.getElementById("caseTitle");
const caseDescriptionInput = document.getElementById("caseDescription");
const projectList = document.getElementById("projectList");
const projectFilter = document.getElementById("projectFilter");
const excelView = document.getElementById("excelView");
const excelContent = document.getElementById("excelContent");

// Botones
document.getElementById("addCase").addEventListener("click", addCase);
document.getElementById("deleteAll").addEventListener("click", deleteAll);
document.getElementById("exportJSON").addEventListener("click", exportJSON);
document.getElementById("importJSON").addEventListener("click", () => document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", importJSON);
document.getElementById("viewAll").addEventListener("click", () => {
  projectFilter.value = "";
  renderProjects();
});
document.getElementById("projectFilter").addEventListener("change", renderProjects);
document.getElementById("uploadExcelBtn").addEventListener("click", () => document.getElementById("uploadExcel").click());
document.getElementById("uploadExcel").addEventListener("change", handleExcel);

function addCase() {
  let projectName = projectNameInput.value.trim();
  const selectedProject = selectProject.value;

  if (!projectName && !selectedProject) {
    return alert("Debes ingresar un nombre de proyecto nuevo o seleccionar uno existente");
  }
  if (selectedProject) {
    projectName = selectedProject;
  }

  const caseTitle = caseTitleInput.value.trim();
  let caseDescription = caseDescriptionInput.value.trim();
  if (!caseTitle || !caseDescription) return alert("Completa todos los campos");

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
    event.target.value = "";
  };
  reader.readAsText(file);
}

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function clearInputs() {
  projectNameInput.value = "";
  selectProject.value = "";
  caseTitleInput.value = "";
  caseDescriptionInput.value = "";
}

function formatDescription(text) {
  if (!text) return "";
  return text
    .split(/\n+/)
    .map(line => `<p>${line.trim()}</p>`)
    .join("");
}

function renderProjects() {
  projectList.innerHTML = "";
  excelView.style.display = "none";

  projectFilter.innerHTML = '<option value="">Todos los proyectos</option>';
  selectProject.innerHTML = '<option value="">-- Selecciona un proyecto existente --</option>';

  projects.forEach((project, projIndex) => {
    const option = document.createElement("option");
    option.value = project.name;
    option.textContent = project.name;
    projectFilter.appendChild(option);

    const option2 = option.cloneNode(true);
    selectProject.appendChild(option2);
  });

  // 🔎 Filtrar solo el proyecto seleccionado
  let filteredProjects = projectFilter.value
    ? projects.filter(p => p.name === projectFilter.value)
    : projects;

  filteredProjects.forEach((project, projIndex) => {
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

      item.querySelector(".btn-danger").addEventListener("click", () => {
        project.cases.splice(i, 1);
        saveProjects();
        renderProjects();
      });

      accordion.appendChild(item);
    });

    card.appendChild(accordion);
    projectList.appendChild(card);
  });
}

function handleExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const html = XLSX.utils.sheet_to_html(firstSheet);

    excelContent.innerHTML = html;
    excelView.style.display = "block";
    projectList.innerHTML = "";
  };
  reader.readAsArrayBuffer(file);
}

renderProjects();











