let data = JSON.parse(localStorage.getItem("projectsData")) || {};

document.getElementById("caseForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const project = document.getElementById("project").value.trim();
  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("desc").value.trim();

  if (!data[project]) data[project] = [];
  data[project].push({ title, desc });

  localStorage.setItem("projectsData", JSON.stringify(data));
  this.reset();
  renderProjects();
});

// Renderizado principal
function renderProjects() {
  const select = document.getElementById("projectSelect");
  const selectedProject = select.value;
  const title = document.getElementById("projectsTitle");

  // Actualizar opciones del select
  select.innerHTML = '<option value="">Todos los proyectos</option>';
  Object.keys(data).forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    if (p === selectedProject) opt.selected = true;
    select.appendChild(opt);
  });

  // Cambiar título dinámico
  if (selectedProject) {
    const count = data[selectedProject]?.length || 0;
    title.textContent = `Lista de Proyectos: ${selectedProject} (${count} casos)`;
  } else {
    title.textContent = "Lista de Proyectos";
  }

  // Mostrar proyectos filtrados
  const list = document.getElementById("projectsList");
  list.innerHTML = "";

  const projectsToShow = selectedProject ? [selectedProject] : Object.keys(data);

  projectsToShow.forEach(project => {
    const div = document.createElement("div");
    div.className = "card p-3 mb-3";
    div.innerHTML = `
      <h5>Proyecto: ${project}</h5>
      <button class="btn btn-sm btn-outline-danger mb-2" onclick="deleteProject('${project}')">🗑️ Eliminar Proyecto</button>
    `;

    data[project].forEach((c, i) => {
      div.innerHTML += `
        <div class="border rounded p-2 mb-2">
          <strong>Caso: ${c.title}</strong><br>
          <small>${c.desc}</small><br>
          <button class="btn btn-sm btn-warning mt-2" onclick="editCase('${project}', ${i})">✏️ Editar</button>
          <button class="btn btn-sm btn-danger mt-2" onclick="deleteCase('${project}', ${i})">🗑️ Eliminar</button>
        </div>
      `;
    });
    list.appendChild(div);
  });
}

// Resetear filtro
function resetFilter() {
  document.getElementById("projectSelect").value = "";
  renderProjects();
}

// Eliminar todo
function deleteAll() {
  if (confirm("¿Seguro que deseas eliminar todos los proyectos y casos?")) {
    data = {};
    localStorage.removeItem("projectsData");
    renderProjects();
  }
}

// Eliminar proyecto
function deleteProject(project) {
  if (confirm(`¿Eliminar proyecto completo "${project}"?`)) {
    delete data[project];
    localStorage.setItem("projectsData", JSON.stringify(data));
    renderProjects();
  }
}

// Eliminar caso
function deleteCase(project, index) {
  if (confirm("¿Eliminar este caso?")) {
    data[project].splice(index, 1);
    localStorage.setItem("projectsData", JSON.stringify(data));
    renderProjects();
  }
}

// Editar caso
function editCase(project, index) {
  const caso = data[project][index];
  document.getElementById("project").value = project;
  document.getElementById("title").value = caso.title;
  document.getElementById("desc").value = caso.desc;

  // Eliminar y volver a agregar (modo "editar")
  data[project].splice(index, 1);
  localStorage.setItem("projectsData", JSON.stringify(data));
  renderProjects();
}

// Cargar al inicio
renderProjects();











