// 🔹 Agregar caso correctamente dentro del proyecto seleccionado
document.getElementById("addCaseBtn").addEventListener("click", () => {
    const newProjectName = document.getElementById("projectName").value.trim();
    const selectedProject = document.getElementById("projectSelect").value;
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

    if (!projects[projectKey]) {
        projects[projectKey] = [];
    }

    projects[projectKey].push({ title: caseTitle, description: caseDesc });
    saveProjects();
    renderProjects();
    populateProjectSelect();

    document.getElementById("caseTitle").value = "";
    document.getElementById("caseDescription").value = "";
    document.getElementById("projectName").value = "";
    document.getElementById("projectSelect").value = "";
});

// 🔹 Renderizar proyectos con filtro y desplegables
function renderProjects() {
    const projectList = document.getElementById("projectList");
    projectList.innerHTML = "";

    const filter = document.getElementById("filterProjects").value;

    Object.keys(projects).forEach(project => {
        if (filter !== "all" && filter !== project) return; // 👈 filtro aplicado

        const projectCard = document.createElement("div");
        projectCard.classList.add("card", "mb-3");

        const projectHeader = document.createElement("div");
        projectHeader.classList.add("card-header", "fw-bold");
        projectHeader.innerHTML = `Proyecto: ${project}`;
        projectCard.appendChild(projectHeader);

        const projectBody = document.createElement("div");
        projectBody.classList.add("card-body");

        projects[project].forEach((c, index) => {
            const accordion = document.createElement("div");
            accordion.classList.add("accordion", "mb-2");

            accordion.innerHTML = `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${project}-${index}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${project}-${index}">
                            Caso: ${c.title}
                        </button>
                    </h2>
                    <div id="collapse-${project}-${index}" class="accordion-collapse collapse" data-bs-parent="#accordion-${project}">
                        <div class="accordion-body">
                            ${c.description}
                            <div class="mt-2">
                                <button class="btn btn-warning btn-sm">Editar</button>
                                <button class="btn btn-danger btn-sm">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            projectBody.appendChild(accordion);
        });

        projectCard.appendChild(projectBody);
        projectList.appendChild(projectCard);
    });
}












