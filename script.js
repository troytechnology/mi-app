// Renderizar proyectos
function renderProjects() {
  const projectList = document.getElementById("projectList");
  projectList.innerHTML = "";

  const filter = document.getElementById("filterProjects").value;

  // Si hay filtro, solo mostramos ese proyecto
  let projectsToShow = Object.keys(projects);
  if (filter !== "all") {
    projectsToShow = projectsToShow.filter(p => p === filter);
  }

  projectsToShow.forEach(project => {
    const card = document.createElement("div");
    card.classList.add("card", "mb-3");

    const header = document.createElement("div");
    header.classList.add("card-header", "fw-bold");
    header.textContent = `Proyecto: ${project}`;
    card.appendChild(header);

    const body = document.createElement("div");
    body.classList.add("card-body");

    const accordion = document.createElement("div");
    accordion.classList.add("accordion");
    accordion.id = `accordion-${project}`;

    projects[project].forEach((c, index) => {
      const item = document.createElement("div");
      item.classList.add("accordion-item");

      item.innerHTML = `
        <h2 class="accordion-header" id="heading-${project}-${index}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${project}-${index}">
            Caso: ${c.title}
          </button>
        </h2>
        <div id="collapse-${project}-${index}" class="accordion-collapse collapse" data-bs-parent="#accordion-${project}">
          <div class="accordion-body">
            ${c.description}
            <div class="mt-2">
              <button class="btn btn-warning btn-sm" onclick="editCase('${project}', ${index})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="deleteCase('${project}', ${index})">Eliminar</button>
            </div>
          </div>
        </div>
      `;

      accordion.appendChild(item);
    });

    body.appendChild(accordion);
    card.appendChild(body);
    projectList.appendChild(card);
  });
}










