<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Gestor de Proyectos y Casos</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  <div class="container my-4">
    <h1 class="mb-4">Gestor de Proyectos y Casos</h1>

    <!-- Formulario -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Agregar Proyecto o Caso</h5>
        
        <input type="text" id="projectName" class="form-control mb-2" placeholder="Nombre del Proyecto (solo si es nuevo)">
        
        <select id="existingProject" class="form-select mb-2">
          <option value="">-- Selecciona un proyecto existente --</option>
        </select>

        <input type="text" id="caseTitle" class="form-control mb-2" placeholder="Título del Caso">
        <textarea id="caseDescription" class="form-control mb-2" placeholder="Descripción del Caso"></textarea>

        <div class="d-flex gap-2">
          <button id="addCase" class="btn btn-primary btn-sm">Agregar Caso</button>
          <button id="clearAll" class="btn btn-danger btn-sm">Eliminar Todo</button>
          <button id="exportJSON" class="btn btn-success btn-sm">Exportar JSON</button>
          <label class="btn btn-secondary btn-sm mb-0">
            Importar JSON
            <input type="file" id="importJSON" accept="application/json" hidden>
          </label>
        </div>
      </div>
    </div>

    <!-- Lista de proyectos -->
    <h3>Lista de Proyectos</h3>
    <div class="d-flex align-items-center mb-3 gap-2">
      <select id="filterProjects" class="form-select w-auto">
        <option value="all">Todos los proyectos</option>
      </select>
      <button id="showAll" class="btn btn-dark btn-sm">Ver todos</button>
    </div>

    <div id="projectList"></div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="script.js"></script>
</body>
</html>








