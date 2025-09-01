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
        <!-- 🔴 BOTÓN ELIMINAR PROYECTO -->
        <button class="btn btn-danger btn-sm ms-2" onclick="deleteProject('${project}')">🗑️</button>
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
                  <!-- 🔴 BOTÓN ELIMINAR CASO -->
                  <button class="btn btn-outline-danger btn-sm ms-2" onclick="deleteCase('${project}', ${caseIndex})">🗑️</button>
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









