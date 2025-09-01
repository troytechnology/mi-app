<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Gestor de Casos</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      background: #f8f9fa;
    }
    .card {
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .btn {
      border-radius: 8px;
    }
  </style>
</head>
<body class="container py-4">
  <h1 class="mb-4">Gestor de Casos</h1>

  <!-- Formulario -->
  <div class="card p-4 mb-4">
    <div class="mb-3">
      <label for="projectSelect" class="form-label">Proyecto</label>
      <div class="d-flex gap-2">
        <select id="projectSelect" class="form-select">
          <option value="">Selecciona un proyecto</option>
        </select>
        <button class="btn btn-success" onclick="addProject()">+ Nuevo Proyecto</button>
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Título del Caso</label>
      <input id="caseTitle" type="text" class="form-control" placeholder="Ej: Análisis de tráfico sospechoso">
    </div>
    <div class="mb-3">
      <label class="form-label">Descripción / Análisis</label>
      <textarea id="caseDescription" class="form-control" rows="3" placeholder="Escribe aquí el análisis o descripción del caso"></textarea>
    </div>
    <button class="btn btn-primary w-100" onclick="addCase()">Agregar Caso</button>
  </div>

  <!-- Botones generales -->
  <div class="mb-3">
    <button class="btn btn-danger" onclick="clearAll()">🗑️ Borrar todo</button>
    <button class="btn btn-success" onclick="exportJSON()">💾 Exportar JSON</button>
    <input type="file" id="importFile" class="d-none" onchange="importJSON(event)">
    <button class="btn btn-secondary" onclick="document.getElementById('importFile').click()">📂 Importar JSON</button>
  </div>

  <!-- Lista de proyectos -->
  <h3>Lista de Proyectos</h3>
  <div id="projectsList"></div>

  <script>
    let data = JSON.parse(localStorage.getItem("caseManager")) || {};

    function saveData() {
      localStorage.setItem("caseManager", JSON.stringify(data));
      renderProjects();
    }

    function addProject() {
      const name = prompt("Nombre del nuevo proyecto:");
      if (!name) return;
      if (!data[name]) {
        data[name] = [];
        saveData();
        document.getElementById("projectSelect").value = name;
      } else {
        alert("Ese proyecto ya existe.");
      }
    }

    function addCase() {
      const project = document.getElementById("projectSelect").value;
      const title = document.getElementById("caseTitle").value.trim();
      const desc = document.getElementById("caseDescription").value.trim();
      if (!project) return alert("Selecciona un proyecto primero.");
      if (!title) return alert("El caso necesita un título.");

      data[project].push({ title, desc });
      document.getElementById("caseTitle").value = "";
      document.getElementById("caseDescription").value = "";
      saveData();
    }

    function deleteCase(project, index) {
      if (confirm("¿Borrar este caso?")) {
        data[project].splice(index, 1);
        saveData();
      }
    }

    function editCase(project, index) {
      const caso = data[project][index];
      const newTitle = prompt("Editar título:", caso.title);
      if (newTitle === null) return;
      const newDesc = prompt("Editar descripción:", caso.desc);
      if (newDesc === null) return;
      data[project][index] = { title: newTitle, desc: newDesc };
      saveData();
    }

    function clearAll() {
      if (confirm("¿Seguro que quieres borrar todo?")) {
        data = {};
        saveData();
      }
    }

    function exportJSON() {
      const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "casos.json";
      a.click();
      URL.revokeObjectURL(url);
    }

    function importJSON(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        try {
          data = JSON.parse(e.target.result);
          saveData();
        } catch {
          alert("Archivo JSON inválido.");
        }
      };
      reader.readAsText(file);
    }

    function renderProjects() {
      const select = document.getElementById("projectSelect");
      select.innerHTML = '<option value="">Selecciona un proyecto</option>';
      Object.keys(data).forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        select.appendChild(opt);
      });

      const list = document.getElementById("projectsList");
      list.innerHTML = "";
      for (let project in data) {
        const div = document.createElement("div");
        div.className = "card p-3 mb-3";
        div.innerHTML = `<h5>${project}</h5>`;
        data[project].forEach((c, i) => {
          div.innerHTML += `
            <div class="border rounded p-2 mb-2">
              <strong>${c.title}</strong><br>
              <small>${c.desc}</small><br>
              <button class="btn btn-sm btn-warning mt-2" onclick="editCase('${project}', ${i})">✏️ Editar</button>
              <button class="btn btn-sm btn-danger mt-2" onclick="deleteCase('${project}', ${i})">🗑️ Eliminar</button>
            </div>
          `;
        });
        list.appendChild(div);
      }
    }

    // Inicializar
    renderProjects();
  </script>
</body>
</html>











