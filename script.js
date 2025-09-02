/***********************
 *  LÓGICA PLAYBOOK
 ***********************/
(function () {
  const excelView = document.getElementById("excelView");
  if (!excelView) return; // No estás en playbook.html, salimos.

  const STORAGE_KEY = "playbookExcelMatrixV2";
  const excelInput = document.getElementById("excelInput");
  const excelForm = document.getElementById("excelForm");
  const clearBtn  = document.getElementById("clearExcelBtn");
  const excelTable = document.getElementById("excelTable");
  const noDataMsg  = document.getElementById("noDataMsg");

  let dt = null; // Referencia a DataTable

  // ========= Helpers =========
  function normalizeMatrix(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0) return [];
    // quitar filas completamente vacías
    const cleaned = matrix.filter(row => Array.isArray(row) && row.some(c => c !== null && c !== undefined && String(c).trim() !== ""));

    // encontrar el número máximo de columnas
    const maxCols = cleaned.reduce((m, row) => Math.max(m, row.length), 0);

    // completar filas con vacíos hasta maxCols
    return cleaned.map(row => {
      const r = [...row];
      while (r.length < maxCols) r.push("");
      return r;
    });
  }

  function renderTable(matrix) {
    const data = normalizeMatrix(matrix);
    if (!data.length) {
      excelView.style.display = "none";
      noDataMsg.style.display = "block";
      return;
    }
    noDataMsg.style.display = "none";
    excelView.style.display = "block";

    // destruir DataTable si ya existe
    if ($.fn.DataTable.isDataTable("#excelTable")) {
      $('#excelTable').DataTable().destroy();
    }
    // limpiar tabla
    excelTable.querySelector("thead").innerHTML = "";
    excelTable.querySelector("tbody").innerHTML = "";

    const headers = data[0];
    const rows    = data.slice(1);

    // thead
    const thead = excelTable.querySelector("thead");
    const trHead = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = (h === undefined || h === null) ? "" : String(h);
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    // tbody
    const tbody = excelTable.querySelector("tbody");
    rows.forEach(r => {
      const tr = document.createElement("tr");
      r.forEach(cell => {
        const td = document.createElement("td");
        td.textContent = (cell === undefined || cell === null) ? "" : String(cell);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    // inicializar DataTable con SearchPanes (filtros tipo Excel con checkboxes)
    dt = new $.fn.dataTable.Buttons; // evita warning raro de algunos bundles
    $('#excelTable').DataTable({
      dom: 'Plfrtip', // P = SearchPanes, l=length, f=filter, r, t, i, p
      searchPanes: {
        cascadePanes: true,
        layout: 'columns-4',
        controls: true,
        viewTotal: true
      },
      columnDefs: [
        { searchPanes: { show: true }, targets: "_all" }
      ],
      paging: true,
      pageLength: 25,
      scrollX: true,
      autoWidth: false,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
      }
    });
  }

  function saveToStorage(matrix) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matrix));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage:", e);
    }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("No se pudo leer localStorage:", e);
      return null;
    }
  }

  // ========= Eventos =========
  excelForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!excelInput.files || !excelInput.files[0]) {
      alert("Selecciona un archivo Excel para actualizar.");
      return;
    }
    const file = excelInput.files[0];
    const reader = new FileReader();

    reader.onload = function (ev) {
      try {
        const data = new Uint8Array(ev.target.result);
        const wb = XLSX.read(data, { type: "array" });

        // Tomamos la primera hoja
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];

        // Array de arrays: primera fila son encabezados
        const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });

        // Guardar y renderizar
        saveToStorage(aoa);
        renderTable(aoa);
        excelInput.value = "";
      } catch (err) {
        console.error(err);
        alert("Error leyendo el Excel. Verifica el archivo.");
      }
    };

    reader.onerror = function () {
      alert("No se pudo leer el archivo.");
    };

    reader.readAsArrayBuffer(file);
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("¿Eliminar el Excel guardado?")) {
      localStorage.removeItem(STORAGE_KEY);
      if ($.fn.DataTable.isDataTable("#excelTable")) {
        $('#excelTable').DataTable().destroy();
      }
      excelTable.querySelector("thead").innerHTML = "";
      excelTable.querySelector("tbody").innerHTML = "";
      excelView.style.display = "none";
      noDataMsg.style.display = "block";
    }
  });

  // ========= Carga inicial (persistencia) =========
  const saved = loadFromStorage();
  if (saved && saved.length) {
    renderTable(saved);
  } else {
    noDataMsg.style.display = "block";
  }
})();





