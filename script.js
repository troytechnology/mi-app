// Obtener datos del almacenamiento local o inicializar
let data = JSON.parse(localStorage.getItem("projectsData")) || {};

// Referencias al DOM
const form = document.getElementById("caseForm");
const projectSelect = document.getElementById("projectSelect");
const newProjectDiv = document.getElementById("newProjectDiv");
const newProjectInput = document.getElementById("newProject");
const projectsAccordion = document.getElementById("projectsAccordion");

// Mostrar proyectos en el select
function updateProjectSelect() {
  // Limpiar excepto opción "nuevo"
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

// Renderizar proyectos y casos en acordeón
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

// Manejar selección de proyecto
projectSelect.addEventListener("change", () => {
  if (projectSelect.value === "nuevo") {
    newProjectDiv.classList.remove("d-none");
    newProjectInput.required = true;
  } else {
    newProjectDiv.classList.add("d-none");
    newProjectInput.required = false;
  }
});

// Manejar envío de formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  let project = projectSelect.value;

  if (project === "nuevo") {
    project = newProjectInput.value.trim();
    if (!project) {
      alert("Debes ingresar un nombre para el nuevo proyecto.");
      return;
    }
    data[project] = data[project] || [];
  }

  // Guardar caso
  data[project].push({ title, description });
  localStorage.setItem("projectsData", JSON.stringify(data));

  // Reset formulario
  form.reset();
  newProjectDiv.classList.add("d-none");

  // Refrescar vistas
  updateProjectSelect();
  renderProjects();
});

// Inicializar
updateProjectSelect();
renderProjects();



