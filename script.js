/* ============================================================
   TBZ STREAMING SERVICES — SCRIPT.JS
   ============================================================ */

/* ---------- CONFIGURACIÓN: EDITAR ACÁ ---------- */
// Los vendedores y el mensaje de pedido ahora se editan desde admin.html
// (quedan guardados dentro de PRODUCTOS.config en productos.js).
// Estos valores de acá abajo son solo un respaldo por si productos.js
// no trae esa sección, para que el sitio nunca se rompa.
const DEFAULT_VENDEDORES = [
  { id: "vendedor tobiaz", nombre: "vendedor Tobiaz", numero: "5492634273255s" },
  { id: "vendedor vulpi prueba", nombre: "Vendedor vulpis prueba", numero: "5492634763377" }
];

const DEFAULT_MENSAJE = {
  saludo: "Hola :D",
  intro: "Quiero comprar:",
  despedida: "quisiera consultar su alias. Muchas gracias.",
  consulta: "Hola! Quiero más información sobre los productos de TBZ Streaming Services."
};

const REDES = {
  instagram: "https://www.instagram.com/servicesstreaming_tbz?igsh=eHljbzRvZDQ5b3M2&utm_source=qr",
  tiktok: "https://tiktok.com/@tuusuario",
  whatsappCanal: "https://whatsapp.com/channel/0029VbDVAKV90x2rPAKpPI3c",
  whatsappGrupo: "https://chat.whatsapp.com/DypekwKWVcX8JuvIg9FnDA"
};
/* ------------------------------------------------ */

/* ---------- CONFIG DINÁMICA (viene de productos.js -> PRODUCTOS.config) ---------- */
function getVendedores(){
  const v = (typeof PRODUCTOS !== "undefined") && PRODUCTOS.config && PRODUCTOS.config.vendedores;
  return (Array.isArray(v) && v.length) ? v : DEFAULT_VENDEDORES;
}

function getMensajeConfig(){
  const m = ((typeof PRODUCTOS !== "undefined") && PRODUCTOS.config && PRODUCTOS.config.mensaje) || {};
  return {
    saludo: m.saludo || DEFAULT_MENSAJE.saludo,
    intro: m.intro || DEFAULT_MENSAJE.intro,
    despedida: m.despedida || DEFAULT_MENSAJE.despedida,
    consulta: m.consulta || DEFAULT_MENSAJE.consulta
  };
}

let pendingMessage = null; // guarda el mensaje armado hasta elegir vendedor
let pendingOrder = null;   // guarda el pedido (cantidad/precio o servicio) hasta ingresar el ID

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initAOS();
  initParticles();
  renderDiamantes();
  renderStreaming();
  renderSectores();
  initTabs();
  initFaq();
  initModal();
  initDataModal();
  initFloatButtons();
  initSmoothNav();
  wireSocialLinks();
});

/* ---------- LOADER ---------- */
function initLoader(){
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 350);
  });
}

/* ---------- AOS ---------- */
function initAOS(){
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 60, easing: "ease-out-cubic" });
  }
}

/* ---------- PARTICLES (hex network background) ---------- */
function initParticles(){
  if (!window.particlesJS) return;
  particlesJS("hero-canvas", {
    particles: {
      number: { value: 46, density: { enable: true, value_area: 900 } },
      color: { value: ["#29E4FF", "#0A5FFF"] },
      shape: { type: "polygon", polygon: { nb_sides: 6 } },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 140, color: "#0A5FFF", opacity: 0.35, width: 1 },
      move: { enable: true, speed: 1.1, direction: "none", random: true, out_mode: "out" }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "grab" }, resize: true },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.6 } } }
    },
    retina_detect: true
  });
}

/* ---------- HELPERS ---------- */
function formatPrice(n){
  return "$" + n.toLocaleString("es-AR");
}

function buildWaLink(numero, mensaje){
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/* ---------- RENDER: DIAMANTES ---------- */
function renderDiamantes(){
  ["ilimitado", "limitado"].forEach(key => {
    const data = PRODUCTOS.diamantes[key];
    const grid = document.getElementById(`grid-${key}`);
    if (!grid) return;
    grid.innerHTML = data.items.map(item => `
      <div class="hex-card diamond-card ${item.destacado ? "featured" : ""}" data-aos="fade-up">
        <span class="badge">${data.badge}</span>
        <i class="fa-solid fa-gem diamond-icon"></i>
        <div class="diamond-qty">${item.cantidad.toLocaleString("es-AR")} <span>diamantes</span></div>
        <div class="diamond-price"><span>Precio</span>${formatPrice(item.precio)}</div>
        <button class="btn btn-primary" style="width:100%; justify-content:center;"
          onclick='comprarDiamantes(${item.cantidad}, ${item.precio})'>
          <i class="fa-solid fa-cart-shopping"></i> Comprar
        </button>
      </div>
    `).join("");
  });

  const extrasRow = document.getElementById("extras-row");
  if (extrasRow) {
    extrasRow.innerHTML = PRODUCTOS.diamantes.extras.map(x => {
      const showStepper = x.minimo > 1;
      return `
      <div class="hex-card extra-card" data-aos="fade-up" data-extra-id="${x.id}">
        <h4>${x.nombre}</h4>
        <p>${x.detalle}</p>
        <div class="price">${formatPrice(x.precio)} <span style="color:var(--muted); font-size:.7rem;">${x.unidad}</span></div>
        ${showStepper ? `
          <div class="extra-qty">
            <button type="button" class="qty-minus" aria-label="Restar">−</button>
            <input type="number" class="qty-input" value="${x.minimo}" min="${x.minimo}" step="1" inputmode="numeric">
            <button type="button" class="qty-plus" aria-label="Sumar">+</button>
          </div>
          <div class="total">Total: <span class="total-value">${formatPrice(x.precio * x.minimo)}</span></div>
        ` : ""}
        <button class="btn btn-primary btn-comprar-extra">
          <i class="fa-solid fa-cart-shopping"></i> Comprar
        </button>
      </div>
    `;
    }).join("");

    wireExtraCards();
  }
}

function wireExtraCards(){
  document.querySelectorAll(".extra-card").forEach(card => {
    const id = card.dataset.extraId;
    const item = PRODUCTOS.diamantes.extras.find(x => x.id === id);
    const input = card.querySelector(".qty-input");
    const totalValue = card.querySelector(".total-value");
    const minus = card.querySelector(".qty-minus");
    const plus = card.querySelector(".qty-plus");

    const updateTotal = () => {
      if (!input || !totalValue) return;
      let qty = parseInt(input.value, 10);
      if (isNaN(qty) || qty < item.minimo) qty = item.minimo;
      input.value = qty;
      totalValue.textContent = formatPrice(item.precio * qty);
    };

    if (minus) minus.addEventListener("click", () => { input.value = Math.max(item.minimo, (parseInt(input.value,10)||item.minimo) - 1); updateTotal(); });
    if (plus) plus.addEventListener("click", () => { input.value = (parseInt(input.value,10)||item.minimo) + 1; updateTotal(); });
    if (input) input.addEventListener("input", updateTotal);

    card.querySelector(".btn-comprar-extra").addEventListener("click", () => {
      const cantidad = input ? Math.max(item.minimo, parseInt(input.value, 10) || item.minimo) : 1;
      comprarExtra(item, cantidad);
    });
  });
}

function comprarExtra(item, cantidad){
  const total = item.precio * cantidad;
  pendingOrder = { tipo: "extra", nombre: item.nombre, cantidad, unidad: item.unidad, precioUnitario: item.precio, total };
  abrirDataModal({
    titulo: "Completá tus datos",
    subtitulo: `${item.nombre}${cantidad > 1 ? " x " + cantidad : ""} · ${formatPrice(total)}`
  });
}

function comprarDiamantes(cantidad, precio){
  pendingOrder = { tipo: "diamantes", cantidad, precio };
  abrirDataModal({
    titulo: "Completá tus datos",
    subtitulo: `${cantidad.toLocaleString("es-AR")} Diamantes · ${formatPrice(precio)}`
  });
}

/* ---------- RENDER: STREAMING ---------- */
function renderStreaming(){
  const grid = document.getElementById("grid-streaming");
  if (!grid) return;
  grid.innerHTML = PRODUCTOS.streaming.map(svc => `
    <div class="hex-card stream-card" data-aos="fade-up">
      <div class="stream-head">
        <div class="stream-icon" style="background:${svc.color}22; color:${svc.color};">
          <i class="${svc.icono}"></i>
        </div>
        <div>
          <h4>${svc.nombre}</h4>
          <p>${svc.tipo}</p>
        </div>
      </div>
      ${svc.planes.map(plan => `
        <div class="plan-row">
          <span>${plan.nombre}</span>
          <span class="plan-price">${plan.consultar ? "Consultar" : formatPrice(plan.precio)}</span>
        </div>
      `).join("")}
      <button class="btn btn-primary" onclick='comprarStreaming(${JSON.stringify(svc.nombre)}, ${JSON.stringify(svc.planes)})'>
        <i class="fa-solid fa-cart-shopping"></i> Comprar
      </button>
    </div>
  `).join("");
}

function comprarStreaming(nombreServicio, planes){
  if (planes.length === 1) {
    // Un solo plan: se arma el mensaje directo, sin necesidad de elegir.
    const plan = planes[0];
    const detalle = plan.consultar
      ? `${nombreServicio}\n\nPlan de interés:\n${plan.nombre} (a consultar)`
      : `${nombreServicio}\n\nPrecio:\n${formatPrice(plan.precio)}`;
    const msj = getMensajeConfig();
    abrirSelectorVendedor(
`${msj.saludo}

${msj.intro}

${detalle}

${msj.despedida}`
    );
    return;
  }
  // Varios planes: el cliente elige antes de armar el mensaje.
  abrirPlanModal(nombreServicio, planes);
}

function abrirPlanModal(nombreServicio, planes){
  document.getElementById("plan-modal-title").textContent = nombreServicio;
  document.getElementById("plan-modal-subtitle").textContent = "Elegí la opción que quieras comprar";
  const optionsWrap = document.getElementById("plan-options");
  optionsWrap.innerHTML = planes.map((plan, i) => `
    <div class="plan-option" data-servicio="${encodeURIComponent(nombreServicio)}" data-index="${i}">
      <span class="plan-name">${plan.nombre}</span>
      <span class="plan-value">${plan.consultar ? "Consultar" : formatPrice(plan.precio)}</span>
    </div>
  `).join("");

  optionsWrap.querySelectorAll(".plan-option").forEach((el, i) => {
    el.addEventListener("click", () => {
      const plan = planes[i];
      const detalle = plan.consultar
        ? `${nombreServicio}\n\nPlan de interés:\n${plan.nombre} (a consultar)`
        : `${nombreServicio}\n\nPlan:\n${plan.nombre}\n\nPrecio:\n${formatPrice(plan.precio)}`;
      const msj = getMensajeConfig();
      cerrarPlanModal();
      abrirSelectorVendedor(
`${msj.saludo}

${msj.intro}

${detalle}

${msj.despedida}`
      );
    });
  });

  document.getElementById("plan-modal").classList.add("show");
}

function cerrarPlanModal(){
  document.getElementById("plan-modal").classList.remove("show");
}

/* ---------- RENDER: SECTORES PERSONALIZADOS ----------
   Sectores son secciones que se crean/editan desde admin.html
   (pestaña "Sectores"), totalmente separadas de Diamantes y
   Streaming: tienen su propia grilla (.sector-grid/.sector-card),
   su propio ícono/estilos (.sector-*) y su propia función de compra
   (comprarSector), así que agregar/editar un sector nunca afecta
   a Diamantes ni a Streaming, ni depende de su código. */
function renderSectores(){
  const container = document.getElementById("sectores-dynamic");
  if (!container) return;

  const sectores = ((typeof PRODUCTOS !== "undefined") && Array.isArray(PRODUCTOS.sectores)) ? PRODUCTOS.sectores : [];
  if (!sectores.length) { container.innerHTML = ""; return; }

  container.innerHTML = sectores.map(sector => `
    <div class="circuit-divider">
      <svg viewBox="0 0 1280 46" preserveAspectRatio="none">
        <path d="M0 23 H520 L545 5 H735 L760 23 H1280"></path>
        <path class="pulse" d="M0 23 H520 L545 5 H735 L760 23 H1280"></path>
      </svg>
    </div>
    <section id="sector-${sector.id}">
      <div class="section-head" data-aos="fade-up">
        ${sector.eyebrow ? `<span class="section-eyebrow">${sector.eyebrow}</span>` : ""}
        <h2>${sector.titulo}</h2>
        ${sector.descripcion ? `<p>${sector.descripcion}</p>` : ""}
      </div>
      <div class="sector-grid" id="grid-sector-${sector.id}"></div>
    </section>
  `).join("");

  sectores.forEach(sector => {
    const grid = document.getElementById(`grid-sector-${sector.id}`);
    if (!grid) return;
    const items = Array.isArray(sector.items) ? sector.items : [];
    grid.innerHTML = items.map(svc => `
      <div class="hex-card sector-card" data-aos="fade-up">
        <div class="sector-head">
          <div class="sector-icon" style="background:${svc.color}22; color:${svc.color};">
            <i class="${svc.icono}"></i>
          </div>
          <div>
            <h4>${svc.nombre}</h4>
            <p>${svc.tipo || ""}</p>
          </div>
        </div>
        ${svc.planes.map(plan => `
          <div class="sector-plan-row">
            <span>${plan.nombre}</span>
            <span class="sector-plan-price">${plan.consultar ? "Consultar" : formatPrice(plan.precio)}</span>
          </div>
        `).join("")}
        <button class="btn btn-primary" onclick='comprarSector(${JSON.stringify(sector.titulo)}, ${JSON.stringify(svc.nombre)}, ${JSON.stringify(svc.planes)})'>
          <i class="fa-solid fa-cart-shopping"></i> Comprar
        </button>
      </div>
    `).join("");
  });

  insertSectorNavLinks(sectores);
}

/* ---------- COMPRA: SECTORES (independiente de comprarStreaming) ---------- */
function comprarSector(nombreSector, nombreProducto, planes){
  if (planes.length === 1) {
    const plan = planes[0];
    const detalle = plan.consultar
      ? `${nombreProducto}\n\nPlan de interés:\n${plan.nombre} (a consultar)`
      : `${nombreProducto}\n\nPrecio:\n${formatPrice(plan.precio)}`;
    const msj = getMensajeConfig();
    abrirSelectorVendedor(
`${msj.saludo}

${msj.intro}

${detalle}

${msj.despedida}`
    );
    return;
  }
  abrirPlanModalSector(nombreProducto, planes);
}

function abrirPlanModalSector(nombreProducto, planes){
  document.getElementById("plan-modal-title").textContent = nombreProducto;
  document.getElementById("plan-modal-subtitle").textContent = "Elegí la opción que quieras comprar";
  const optionsWrap = document.getElementById("plan-options");
  optionsWrap.innerHTML = planes.map((plan, i) => `
    <div class="plan-option" data-index="${i}">
      <span class="plan-name">${plan.nombre}</span>
      <span class="plan-value">${plan.consultar ? "Consultar" : formatPrice(plan.precio)}</span>
    </div>
  `).join("");

  optionsWrap.querySelectorAll(".plan-option").forEach((el, i) => {
    el.addEventListener("click", () => {
      const plan = planes[i];
      const detalle = plan.consultar
        ? `${nombreProducto}\n\nPlan de interés:\n${plan.nombre} (a consultar)`
        : `${nombreProducto}\n\nPlan:\n${plan.nombre}\n\nPrecio:\n${formatPrice(plan.precio)}`;
      const msj = getMensajeConfig();
      cerrarPlanModal();
      abrirSelectorVendedor(
`${msj.saludo}

${msj.intro}

${detalle}

${msj.despedida}`
      );
    });
  });

  document.getElementById("plan-modal").classList.add("show");
}

function insertSectorNavLinks(sectores){
  const navLinks = document.querySelector(".nav-links");
  const footerLinks = document.querySelector(".footer-links");
  const grupoNav = navLinks ? navLinks.querySelector('a[href="#grupo-whatsapp"]') : null;
  const grupoFooter = footerLinks ? footerLinks.querySelector('a[href="#grupo-whatsapp"]') : null;

  sectores.forEach(sector => {
    const href = `#sector-${sector.id}`;

    if (navLinks && grupoNav && !navLinks.querySelector(`a[href="${href}"]`)) {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = sector.titulo;
      navLinks.insertBefore(a, grupoNav);
    }
    if (footerLinks && grupoFooter && !footerLinks.querySelector(`a[href="${href}"]`)) {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = sector.titulo;
      footerLinks.insertBefore(a, grupoFooter);
    }
  });
}

/* ---------- TABS DIAMANTES ---------- */
function initTabs(){
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });
}

/* ---------- FAQ ACCORDION ---------- */
function initFaq(){
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    q.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });
}

/* ---------- MODAL DE DATOS (ID / UID) ---------- */
function initDataModal(){
  const overlay = document.getElementById("data-modal");
  const input = document.getElementById("input-uid");
  const error = document.getElementById("uid-error");
  const continueBtn = document.getElementById("data-modal-continue");

  document.getElementById("data-modal-close").addEventListener("click", () => closeDataModal());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeDataModal(); });

  continueBtn.addEventListener("click", () => {
    const uid = input.value.trim();
    if (!uid) {
      error.style.display = "block";
      input.focus();
      return;
    }
    error.style.display = "none";

    const msj = getMensajeConfig();

    if (pendingOrder && pendingOrder.tipo === "diamantes") {
      const { cantidad, precio } = pendingOrder;
      const mensaje =
`${msj.saludo}

${msj.intro}

Producto:
${cantidad.toLocaleString("es-AR")} Diamantes

Precio:
${formatPrice(precio)}

Mi UID es:
${uid}

${msj.despedida}`;
      closeDataModal();
      abrirSelectorVendedor(mensaje);
    } else if (pendingOrder && pendingOrder.tipo === "extra") {
      const { nombre, cantidad, unidad, precioUnitario, total } = pendingOrder;
      const mensaje =
`${msj.saludo}

${msj.intro}

Producto:
${nombre}${cantidad > 1 ? ` x ${cantidad}` : ""}

Precio unitario:
${formatPrice(precioUnitario)} ${unidad}

Total:
${formatPrice(total)}

Mi UID es:
${uid}

${msj.despedida}`;
      closeDataModal();
      abrirSelectorVendedor(mensaje);
    }
  });

  // Enter para continuar
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") continueBtn.click();
  });
}

function abrirDataModal({ titulo, subtitulo }){
  document.getElementById("data-modal-title").textContent = titulo;
  document.getElementById("data-modal-subtitle").textContent = subtitulo;
  document.getElementById("input-uid").value = "";
  document.getElementById("uid-error").style.display = "none";
  document.getElementById("data-modal").classList.add("show");
  setTimeout(() => document.getElementById("input-uid").focus(), 200);
}

function closeDataModal(){
  document.getElementById("data-modal").classList.remove("show");
  pendingOrder = null;
}


function renderSellerOptions(){
  const container = document.getElementById("seller-options");
  if (!container) return;
  const vendedores = getVendedores();
  container.innerHTML = vendedores.map(v => `
    <div class="seller-option" data-seller="${v.id}">
      <span>${v.nombre}</span>
      <i class="fa-brands fa-whatsapp"></i>
    </div>
  `).join("");
}

function initModal(){
  const overlay = document.getElementById("seller-modal");
  document.getElementById("seller-close").addEventListener("click", () => closeModal());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

  renderSellerOptions();
  const vendedores = getVendedores();
  document.getElementById("seller-options").querySelectorAll(".seller-option").forEach(opt => {
    opt.addEventListener("click", () => {
      const seller = vendedores.find(v => v.id === opt.dataset.seller);
      if (pendingMessage && seller) {
        window.open(buildWaLink(seller.numero, pendingMessage), "_blank");
      }
      closeModal();
    });
  });

  const planOverlay = document.getElementById("plan-modal");
  document.getElementById("plan-modal-close").addEventListener("click", () => cerrarPlanModal());
  planOverlay.addEventListener("click", (e) => { if (e.target === planOverlay) cerrarPlanModal(); });
}

function abrirSelectorVendedor(mensaje){
  pendingMessage = mensaje;
  document.getElementById("seller-modal").classList.add("show");
}

function closeModal(){
  document.getElementById("seller-modal").classList.remove("show");
  pendingMessage = null;
}

/* ---------- FLOATING BUTTONS ---------- */
function initFloatButtons(){
  const waFloat = document.getElementById("wa-float");
  waFloat.addEventListener("click", () => {
    abrirSelectorVendedor(getMensajeConfig().consulta);
  });

  const topBtn = document.getElementById("top-btn");
  window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 500);
  });
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- NAV SMOOTH SCROLL + MOBILE ---------- */
function initSmoothNav(){
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

/* ---------- REDES SOCIALES ---------- */
function wireSocialLinks(){
  const ig = document.getElementById("social-instagram");
  const tk = document.getElementById("social-tiktok");
  const wa = document.getElementById("social-whatsapp");
  if (ig) ig.href = REDES.instagram;
  if (tk) tk.href = REDES.tiktok;
  if (wa) wa.href = REDES.whatsappCanal;

  document.querySelectorAll(".js-group-link").forEach(el => { el.href = REDES.whatsappGrupo; });
}