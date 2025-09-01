// Guardar y obtener datos de LocalStorage
function getCases() {
  return JSON.parse(localStorage.getItem("cases")) || [];
}

function saveCases(cases) {
  localStorage.setItem("cases", JSON.stringify(cases));
}

// Renderizar tabla
function renderCases() {
  const cases = getCases();
  const tbody = document.querySelector("#casesTable tbody");
  tbody.innerHTML = "";

  cases.forEach((c, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${c.title}</td>
        <td>${c.status}</td>
        <td>${c.description}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteCase(${index})">🗑️</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Eliminar caso
function deleteCase(index) {
  const cases = getCases();
  cases.splice(index, 1);
  saveCases(cases);
  renderCases();
}

// Manejar formulario
document.querySelector("#caseForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const status = document.querySelector("#status").value;
  const description = document.querySelector("#description").value;

  const newCase = { title, status, description };

  const cases = getCases();
  cases.push(newCase);
  saveCases(cases);

  renderCases();
  this.reset();
});

// Inicializar
renderCases();
