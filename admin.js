/* ============================================================
   TBZ — ADMIN.JS
   Panel local para editar productos sin tocar código.
   Trabaja sobre una copia en memoria de PRODUCTOS (de productos.js)
   y al final genera un productos.js nuevo para descargar.
   ============================================================ */

// Copia de trabajo (no modifica productos.js hasta que generás el archivo)
const state = JSON.parse(JSON.stringify(PRODUCTOS));

// Por si el productos.js cargado es viejo y todavía no tiene "config"
// (así el panel nunca se rompe, aunque falte esa parte).
if (!state.config) {
  state.config = {
    vendedores: [
      { id: "vendedor1", nombre: "Vendedor 1", numero: "" },
      { id: "vendedor2", nombre: "Vendedor 2", numero: "" }
    ],
    mensaje: {
      saludo: "Hola.",
      intro: "Quiero comprar:",
      despedida: "Muchas gracias.",
      consulta: "Hola! Quiero más información sobre los productos de TBZ Streaming Services."
    }
  };
}
if (!state.config.vendedores) state.config.vendedores = [];
if (!state.config.mensaje) {
  state.config.mensaje = { saludo: "Hola.", intro: "Quiero comprar:", despedida: "Muchas gracias.", consulta: "" };
}

// Por si el productos.js cargado es viejo y todavía no tiene "sectores"
// (secciones nuevas, independientes de diamantes/streaming).
if (!Array.isArray(state.sectores)) state.sectores = [];
state.sectores.forEach(sector => { if (!Array.isArray(sector.items)) sector.items = []; });

document.addEventListener("DOMContentLoaded", () => {
  renderDiamanteList("ilimitado");
  renderDiamanteList("limitado");
  renderExtrasList();
  renderStreamingList();
  renderSectoresList();
  renderVendedoresList();
  renderMensajeConfig();
  initAdminTabs();
});

function initAdminTabs(){
  document.querySelectorAll(".admin-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.panel).classList.add("active");
    });
  });
}

/* ---------- DIAMANTES ---------- */
function renderDiamanteList(key){
  const container = document.getElementById(`admin-list-${key}`);
  const items = state.diamantes[key].items;
  container.innerHTML = items.map((item, i) => `
    <div class="admin-row">
      <input type="number" value="${item.cantidad}" onchange="updateDiamante('${key}', ${i}, 'cantidad', this.value)">
      <input type="number" value="${item.precio}" onchange="updateDiamante('${key}', ${i}, 'precio', this.value)">
      <label class="chk"><input type="checkbox" ${item.destacado ? "checked" : ""} onchange="updateDiamante('${key}', ${i}, 'destacado', this.checked)"> Destacado</label>
      <button class="admin-remove" onclick="removeDiamante('${key}', ${i})"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join("");
}

function updateDiamante(key, index, field, value){
  if (field === "destacado") {
    state.diamantes[key].items[index][field] = value;
  } else {
    state.diamantes[key].items[index][field] = Number(value);
  }
}

function removeDiamante(key, index){
  state.diamantes[key].items.splice(index, 1);
  renderDiamanteList(key);
}

function addDiamante(key){
  const cantidad = Number(document.getElementById(`new-${key}-cantidad`).value);
  const precio = Number(document.getElementById(`new-${key}-precio`).value);
  if (!cantidad || !precio) { alert("Completá cantidad y precio."); return; }
  state.diamantes[key].items.push({ id: `d-${key}-${Date.now()}`, cantidad, precio });
  document.getElementById(`new-${key}-cantidad`).value = "";
  document.getElementById(`new-${key}-precio`).value = "";
  renderDiamanteList(key);
}

/* ---------- EXTRAS ---------- */
function renderExtrasList(){
  const container = document.getElementById("admin-list-extras");
  container.innerHTML = state.diamantes.extras.map((x, i) => `
    <div class="admin-row admin-row--5">
      <input type="text" value="${x.nombre}" onchange="updateExtra(${i}, 'nombre', this.value)">
      <input type="text" value="${x.detalle}" onchange="updateExtra(${i}, 'detalle', this.value)">
      <input type="number" value="${x.precio}" onchange="updateExtra(${i}, 'precio', this.value)">
      <input type="text" value="${x.unidad || ""}" onchange="updateExtra(${i}, 'unidad', this.value)">
      <input type="number" value="${x.minimo || 1}" onchange="updateExtra(${i}, 'minimo', this.value)">
      <button class="admin-remove" onclick="removeExtra(${i})"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join("");
}

function updateExtra(index, field, value){
  state.diamantes.extras[index][field] = (field === "precio" || field === "minimo") ? Number(value) : value;
}

function removeExtra(index){
  state.diamantes.extras.splice(index, 1);
  renderExtrasList();
}

function addExtra(){
  const nombre = document.getElementById("new-extra-nombre").value.trim();
  const detalle = document.getElementById("new-extra-detalle").value.trim();
  const precio = Number(document.getElementById("new-extra-precio").value);
  const unidad = document.getElementById("new-extra-unidad").value.trim();
  const minimo = Number(document.getElementById("new-extra-minimo").value) || 1;
  if (!nombre || !precio) { alert("Completá al menos nombre y precio."); return; }
  state.diamantes.extras.push({ id: `x-${Date.now()}`, nombre, detalle, precio, unidad, minimo });
  ["new-extra-nombre","new-extra-detalle","new-extra-precio","new-extra-unidad"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("new-extra-minimo").value = 1;
  renderExtrasList();
}

/* ---------- STREAMING ---------- */
function renderStreamingList(){
  const container = document.getElementById("admin-list-streaming");
  container.innerHTML = state.streaming.map((svc, si) => `
    <div class="service-block">
      <div class="service-top">
        <input type="text" value="${svc.nombre}" placeholder="Nombre" onchange="updateService(${si}, 'nombre', this.value)">
        <input type="text" value="${svc.tipo}" placeholder="Tipo" onchange="updateService(${si}, 'tipo', this.value)">
        <input type="text" value="${svc.icono}" placeholder="Ícono (Font Awesome)" onchange="updateService(${si}, 'icono', this.value)">
        <input type="color" value="${svc.color}" title="Color de marca" style="padding:2px; height:38px; cursor:pointer;" onchange="updateService(${si}, 'color', this.value)">
        <button class="admin-remove" onclick="removeService(${si})"><i class="fa-solid fa-trash"></i></button>
      </div>
      <div id="plans-${si}"></div>
      <button class="add-plan-btn" onclick="addPlan(${si})"><i class="fa-solid fa-plus"></i> Agregar plan</button>
    </div>
  `).join("");

  state.streaming.forEach((svc, si) => renderPlans(si));
}

function renderPlans(si){
  const container = document.getElementById(`plans-${si}`);
  const planes = state.streaming[si].planes;
  container.innerHTML = planes.map((p, pi) => `
    <div class="plan-line">
      <input type="text" value="${p.nombre}" placeholder="Nombre del plan" onchange="updatePlan(${si}, ${pi}, 'nombre', this.value)">
      <input type="number" value="${p.precio ?? ""}" placeholder="Precio" ${p.consultar ? "disabled" : ""} onchange="updatePlan(${si}, ${pi}, 'precio', this.value)">
      <label class="chk"><input type="checkbox" ${p.consultar ? "checked" : ""} onchange="togglePlanConsultar(${si}, ${pi}, this.checked)"> A consultar</label>
      <button class="admin-remove" onclick="removePlan(${si}, ${pi})"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join("");
}

function updateService(si, field, value){ state.streaming[si][field] = value; }

function removeService(si){
  state.streaming.splice(si, 1);
  renderStreamingList();
}

const NUEVO_SERVICIO_PALETA = ["#FF3D81", "#7C4DFF", "#00E5A0", "#FF8A3D", "#3DDBFF", "#FFD23D", "#FF5C5C", "#5CFFB2"];
let paletaIndex = 0;

function addService(){
  const color = NUEVO_SERVICIO_PALETA[paletaIndex % NUEVO_SERVICIO_PALETA.length];
  paletaIndex++;
  state.streaming.push({
    id: `svc-${Date.now()}`,
    nombre: "Nuevo servicio",
    tipo: "Tipo de servicio",
    icono: "fa-solid fa-play",
    color: color,
    planes: [{ nombre: "Plan único", precio: 0 }]
  });
  renderStreamingList();
}

function updatePlan(si, pi, field, value){
  state.streaming[si].planes[pi][field] = field === "precio" ? Number(value) : value;
}

function togglePlanConsultar(si, pi, checked){
  state.streaming[si].planes[pi].consultar = checked;
  if (checked) state.streaming[si].planes[pi].precio = null;
  renderPlans(si);
}

function removePlan(si, pi){
  state.streaming[si].planes.splice(pi, 1);
  renderPlans(si);
}

function addPlan(si){
  state.streaming[si].planes.push({ nombre: "Nuevo plan", precio: 0 });
  renderPlans(si);
}

/* ---------- SECTORES PERSONALIZADOS ----------
   Secciones nuevas e independientes de Diamantes/Streaming (ej: "Plantillas Canva").
   Cada sector tiene título/eyebrow/descripción + una lista de productos con
   planes, igual estructura que un servicio de Streaming. Nada de esto toca
   state.diamantes ni state.streaming. */

function slugify(texto){
  return texto.toString().toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // sin acentos
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function renderSectoresList(){
  const container = document.getElementById("admin-list-sectores");
  if (!container) return;

  if (!state.sectores.length) {
    container.innerHTML = `<p style="color:var(--muted); font-size:.82rem; margin-bottom:10px;">Todavía no creaste ningún sector. Usá el formulario de abajo para agregar el primero.</p>`;
    return;
  }

  container.innerHTML = state.sectores.map((sector, si) => `
    <div class="sector-block">
      <div class="sector-top">
        <input type="text" value="${sector.titulo}" placeholder="Título del sector" onchange="updateSector(${si}, 'titulo', this.value)">
        <input type="text" value="${sector.eyebrow || ""}" placeholder="Eyebrow / categoría" onchange="updateSector(${si}, 'eyebrow', this.value)">
        <button class="admin-remove" onclick="removeSector(${si})"><i class="fa-solid fa-trash"></i></button>
      </div>
      <textarea class="sector-desc" placeholder="Descripción del sector" onchange="updateSector(${si}, 'descripcion', this.value)">${sector.descripcion || ""}</textarea>
      <div id="sector-items-${si}"></div>
      <button class="add-plan-btn" onclick="addSectorItem(${si})"><i class="fa-solid fa-plus"></i> Agregar producto/servicio a este sector</button>
    </div>
  `).join("");

  state.sectores.forEach((sector, si) => renderSectorItems(si));
}

function renderSectorItems(si){
  const container = document.getElementById(`sector-items-${si}`);
  if (!container) return;
  const items = state.sectores[si].items;
  container.innerHTML = items.map((svc, ii) => `
    <div class="service-block">
      <div class="service-top">
        <input type="text" value="${svc.nombre}" placeholder="Nombre" onchange="updateSectorItem(${si}, ${ii}, 'nombre', this.value)">
        <input type="text" value="${svc.tipo || ""}" placeholder="Tipo" onchange="updateSectorItem(${si}, ${ii}, 'tipo', this.value)">
        <input type="text" value="${svc.icono || ""}" placeholder="Ícono (Font Awesome)" onchange="updateSectorItem(${si}, ${ii}, 'icono', this.value)">
        <input type="color" value="${svc.color || '#29E4FF'}" title="Color de marca" style="padding:2px; height:38px; cursor:pointer;" onchange="updateSectorItem(${si}, ${ii}, 'color', this.value)">
        <button class="admin-remove" onclick="removeSectorItem(${si}, ${ii})"><i class="fa-solid fa-trash"></i></button>
      </div>
      <div id="sector-${si}-plans-${ii}"></div>
      <button class="add-plan-btn" onclick="addSectorPlan(${si}, ${ii})"><i class="fa-solid fa-plus"></i> Agregar plan</button>
    </div>
  `).join("");

  items.forEach((svc, ii) => renderSectorPlans(si, ii));
}

function renderSectorPlans(si, ii){
  const container = document.getElementById(`sector-${si}-plans-${ii}`);
  if (!container) return;
  const planes = state.sectores[si].items[ii].planes;
  container.innerHTML = planes.map((p, pi) => `
    <div class="plan-line">
      <input type="text" value="${p.nombre}" placeholder="Nombre del plan" onchange="updateSectorPlan(${si}, ${ii}, ${pi}, 'nombre', this.value)">
      <input type="number" value="${p.precio ?? ""}" placeholder="Precio" ${p.consultar ? "disabled" : ""} onchange="updateSectorPlan(${si}, ${ii}, ${pi}, 'precio', this.value)">
      <label class="chk"><input type="checkbox" ${p.consultar ? "checked" : ""} onchange="toggleSectorPlanConsultar(${si}, ${ii}, ${pi}, this.checked)"> A consultar</label>
      <button class="admin-remove" onclick="removeSectorPlan(${si}, ${ii}, ${pi})"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join("");
}

function updateSector(si, field, value){
  state.sectores[si][field] = value;
}

function removeSector(si){
  if (!confirm("¿Eliminar este sector completo, con todos sus productos? No se puede deshacer.")) return;
  state.sectores.splice(si, 1);
  renderSectoresList();
}

const SECTOR_PALETA = ["#29E4FF", "#FF3D81", "#7C4DFF", "#00E5A0", "#FF8A3D", "#FFD23D", "#FF5C5C", "#5CFFB2"];
let sectorPaletaIndex = 0;

function addSector(){
  const titulo = document.getElementById("new-sector-titulo").value.trim();
  const eyebrow = document.getElementById("new-sector-eyebrow").value.trim();
  const descripcion = document.getElementById("new-sector-descripcion").value.trim();
  if (!titulo) { alert("Ponele un título al sector antes de crearlo."); return; }

  let baseId = slugify(titulo) || `sector-${Date.now()}`;
  let id = baseId, n = 1;
  while (state.sectores.some(s => s.id === id)) { id = `${baseId}-${n++}`; }

  state.sectores.push({ id, titulo, eyebrow, descripcion, items: [] });

  document.getElementById("new-sector-titulo").value = "";
  document.getElementById("new-sector-eyebrow").value = "";
  document.getElementById("new-sector-descripcion").value = "";
  renderSectoresList();
}

function addSectorItem(si){
  const color = SECTOR_PALETA[sectorPaletaIndex % SECTOR_PALETA.length];
  sectorPaletaIndex++;
  state.sectores[si].items.push({
    id: `item-${Date.now()}`,
    nombre: "Nuevo producto",
    tipo: "",
    icono: "fa-solid fa-star",
    color,
    planes: [{ nombre: "Plan único", precio: 0 }]
  });
  renderSectorItems(si);
}

function updateSectorItem(si, ii, field, value){
  state.sectores[si].items[ii][field] = value;
}

function removeSectorItem(si, ii){
  state.sectores[si].items.splice(ii, 1);
  renderSectorItems(si);
}

function addSectorPlan(si, ii){
  state.sectores[si].items[ii].planes.push({ nombre: "Nuevo plan", precio: 0 });
  renderSectorPlans(si, ii);
}

function updateSectorPlan(si, ii, pi, field, value){
  state.sectores[si].items[ii].planes[pi][field] = field === "precio" ? Number(value) : value;
}

function toggleSectorPlanConsultar(si, ii, pi, checked){
  state.sectores[si].items[ii].planes[pi].consultar = checked;
  if (checked) state.sectores[si].items[ii].planes[pi].precio = null;
  renderSectorPlans(si, ii);
}

function removeSectorPlan(si, ii, pi){
  state.sectores[si].items[ii].planes.splice(pi, 1);
  renderSectorPlans(si, ii);
}

/* ---------- VENDEDORES ---------- */
function renderVendedoresList(){
  const container = document.getElementById("admin-list-vendedores");
  if (!container) return;
  container.innerHTML = state.config.vendedores.map((v, i) => `
    <div class="vendedor-card">
      <div class="vendedor-card-name" id="vendedor-name-${i}">${v.nombre ? v.nombre : `Vendedor ${i + 1}`}</div>
      <div class="admin-row admin-row--3">
        <input type="text" value="${v.nombre}" placeholder="Nombre del vendedor"
          oninput="syncVendedorLabel(${i}, this.value)"
          onchange="updateVendedor(${i}, 'nombre', this.value)">
        <input type="text" value="${v.numero}" placeholder="Número (ej: 5492611234567)" onchange="updateVendedor(${i}, 'numero', this.value)">
        <button class="admin-remove" onclick="removeVendedor(${i})"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join("");
}

function syncVendedorLabel(index, value){
  const label = document.getElementById(`vendedor-name-${index}`);
  if (label) label.textContent = value.trim() ? value.trim() : `Vendedor ${index + 1}`;
}

function updateVendedor(index, field, value){
  state.config.vendedores[index][field] = value.trim();
  if (field === "nombre") syncVendedorLabel(index, value);
}

function removeVendedor(index){
  if (state.config.vendedores.length <= 1) {
    alert("Tiene que quedar al menos un vendedor cargado.");
    return;
  }
  state.config.vendedores.splice(index, 1);
  renderVendedoresList();
}

function addVendedor(){
  const nombre = document.getElementById("new-vendedor-nombre").value.trim();
  const numero = document.getElementById("new-vendedor-numero").value.trim();
  if (!nombre || !numero) { alert("Completá nombre y número."); return; }
  if (!/^\d{10,15}$/.test(numero)) {
    alert("El número tiene que tener solo dígitos, en formato internacional sin \"+\" ni espacios (ej: 5492611234567).");
    return;
  }
  state.config.vendedores.push({ id: `vendedor-${Date.now()}`, nombre, numero });
  document.getElementById("new-vendedor-nombre").value = "";
  document.getElementById("new-vendedor-numero").value = "";
  renderVendedoresList();
}

/* ---------- MENSAJE DE PEDIDO ---------- */
function renderMensajeConfig(){
  const m = state.config.mensaje;
  const saludo = document.getElementById("msg-saludo");
  const intro = document.getElementById("msg-intro");
  const despedida = document.getElementById("msg-despedida");
  const consulta = document.getElementById("msg-consulta");
  if (saludo) saludo.value = m.saludo || "";
  if (intro) intro.value = m.intro || "";
  if (despedida) despedida.value = m.despedida || "";
  if (consulta) consulta.value = m.consulta || "";
}

function updateMensaje(field, value){
  state.config.mensaje[field] = value;
}

/* ---------- GENERAR ARCHIVO ---------- */
function generarArchivo(){
  const advertencias = [];
  state.streaming.forEach(svc => {
    svc.planes.forEach(p => {
      if (!p.consultar && (!p.precio || p.precio <= 0)) {
        advertencias.push(`"${svc.nombre}" → plan "${p.nombre}" no tiene precio cargado.`);
      }
    });
  });
  state.sectores.forEach(sector => {
    sector.items.forEach(svc => {
      svc.planes.forEach(p => {
        if (!p.consultar && (!p.precio || p.precio <= 0)) {
          advertencias.push(`Sector "${sector.titulo}" → "${svc.nombre}" → plan "${p.nombre}" no tiene precio cargado.`);
        }
      });
    });
  });
  state.config.vendedores.forEach(v => {
    if (!v.numero || !/^\d{10,15}$/.test(v.numero)) {
      advertencias.push(`Vendedor "${v.nombre}" tiene un número inválido o vacío.`);
    }
  });
  if (advertencias.length) {
    const seguir = confirm(
      "Ojo, encontré planes sin precio:\n\n" + advertencias.join("\n") +
      "\n\n¿Generar el archivo igual? (el mensaje de WhatsApp para esos planes mostraría $0)"
    );
    if (!seguir) return;
  }

  const header =
`/* ============================================================
   TBZ STREAMING SERVICES — CATÁLOGO DE PRODUCTOS
   ------------------------------------------------------------
   Generado desde el panel de administración (admin.html).
   Reemplazá el productos.js de tu sitio por este archivo.
   ============================================================ */

const PRODUCTOS = `;

  const body = JSON.stringify(state, null, 2);
  const footer = ";\n";
  const finalCode = header + body + footer;

  document.getElementById("output-code").value = finalCode;

  const blob = new Blob([finalCode], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "PRODUCTOS_1.js";
  a.click();
  URL.revokeObjectURL(url);
}