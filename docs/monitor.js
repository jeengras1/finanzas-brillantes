const backendBase = "http://127.0.0.1:5051";

const statusEl = document.getElementById("status");
const tsEl = document.getElementById("timestamp");
const pathInput = document.getElementById("path-input");
const loadBtn = document.getElementById("load-path");
const fileList = document.getElementById("file-list");
const filePathEl = document.getElementById("file-path");
const fileContentEl = document.getElementById("file-content");

async function checkEstado() {
  try {
    const res = await fetch(backendBase + "/estado");
    if (!res.ok) throw new Error("Estado no OK");
    const data = await res.json();
    statusEl.textContent = "● ONLINE";
    statusEl.className = "status-online";
    const date = new Date(data.timestamp * 1000);
    tsEl.textContent = "Último latido: " + date.toLocaleString();
  } catch (e) {
    statusEl.textContent = "● OFFLINE";
    statusEl.className = "status-offline";
    tsEl.textContent = "Sin conexión al backend";
  }
}

async function loadPath(path) {
  try {
    const res = await fetch(backendBase + "/carpetas?path=" + encodeURIComponent(path));
    if (!res.ok) throw new Error("Error al listar");
    const data = await res.json();
    fileList.innerHTML = "";
    (data.items || []).forEach(item => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = item.name;
      span.className = item.type === "dir" ? "type-dir" : "type-file";
      li.appendChild(span);
      li.addEventListener("click", () => {
        if (item.type === "dir") {
          const newPath = (path ? path + "/" : "") + item.name;
          pathInput.value = newPath;
          loadPath(newPath);
        } else {
          const filePath = (path ? path + "/" : "") + item.name;
          loadFile(filePath);
        }
      });
      fileList.appendChild(li);
    });
  } catch (e) {
    fileList.innerHTML = "<li>Error al cargar ruta</li>";
  }
}

async function loadFile(path) {
  try {
    const res = await fetch(backendBase + "/archivo?path=" + encodeURIComponent(path));
    if (!res.ok) throw new Error("Error al leer archivo");
    const data = await res.json();
    filePathEl.textContent = "Archivo: " + path;
    fileContentEl.textContent = data.content;
  } catch (e) {
    filePathEl.textContent = "Archivo: " + path;
    fileContentEl.textContent = "Error al leer archivo.";
  }
}

loadBtn.addEventListener("click", () => {
  loadPath(pathInput.value.trim());
});

checkEstado();
setInterval(checkEstado, 10000);
loadPath("");
