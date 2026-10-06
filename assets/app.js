/* Identificador de seguimiento para los enlaces de producto. */
const PORTAL_CONFIG = { amazonAffiliateTag: "lzr0ab-21" };
let plannerStarted = false;
let plannerCompleted = false;
let plannerReturnTracked = false;

/* Eventos de GA4: solo registran interacciones y contexto de la página,
   nunca textos introducidos, identificadores personales ni datos de salud. */
function trackEvent(name, parameters = {}) {
  if (!window.cookieAnalyticsGranted || typeof window.gtag !== "function") return;
  window.gtag("event", name, parameters);
}

function startPlannerTracking() {
  if (plannerStarted) return;
  plannerStarted = true;
  trackEvent("planner_started");
}

const products = {
  agua: [
    { icon: "01", title: "Reserva de agua", text: "Envases seguros, fáciles de rotar y adaptados al espacio disponible.", query: "garrafa agua potable almacenamiento" },
    { icon: "02", title: "Filtro portátil", text: "Un respaldo compacto para situaciones en las que el suministro no sea fiable.", query: "filtro agua portátil emergencia" },
    { icon: "03", title: "Botella resistente", text: "Reutilizable, hermética y cómoda para transportar fuera de casa.", query: "botella acero inoxidable resistente" },
    { icon: "04", title: "Pastillas potabilizadoras", text: "Un respaldo ultraligero para tratar agua cuando sea necesario. Sigue siempre la dosis y las instrucciones del fabricante.", query: "pastillas potabilizadoras agua emergencia" }
  ],
  comida: [
    { icon: "01", title: "Alimentos básicos", text: "Opciones que conoces, no requieren cocinado y puedes ir rotando.", query: "alimentos larga duración conserva" },
    { icon: "02", title: "Abrelatas manual", text: "Un básico pequeño que no depende de batería ni electricidad.", query: "abrelatas manual acero" },
    { icon: "03", title: "Cubiertos reutilizables", text: "Un juego ligero para comer y servir sin generar más residuos.", query: "cubiertos camping reutilizables" }
  ],
  luz: [
    { icon: "01", title: "Linterna frontal", text: "Deja las manos libres y resulta más práctica que una linterna convencional.", query: "linterna frontal recargable" },
    { icon: "02", title: "Radio de emergencia", text: "Busca una con varias opciones de carga y recepción de alertas locales.", query: "radio emergencia manivela solar" },
    { icon: "03", title: "Batería externa", text: "Capacidad suficiente y cables compatibles con los dispositivos del hogar.", query: "batería externa power bank USB C" },
    { icon: "04", title: "Cable de carga", text: "Guarda un cable corto compatible con tu teléfono dentro de la mochila, no solo junto al cargador de casa.", query: "cable USB C carga rápida resistente" }
  ],
  salud: [
    { icon: "01", title: "Botiquín adaptable", text: "Un punto de partida para completar según indicaciones sanitarias y necesidades personales.", query: "botiquín primeros auxilios hogar" },
    { icon: "02", title: "Higiene esencial", text: "Jabón, toallitas, productos menstruales y artículos que uses habitualmente.", query: "kit higiene viaje reutilizable" },
    { icon: "03", title: "Mascarillas FFP2", text: "Un recurso útil para polvo, humo u otras situaciones específicas, si sabes cuándo usarlo.", query: "mascarillas FFP2 homologadas" }
  ],
  salida: [
    { icon: "01", title: "Mochila cómoda", text: "Ajustable, resistente y de una capacidad que puedas cargar de verdad.", query: "mochila senderismo 25 litros" },
    { icon: "02", title: "Funda de documentos", text: "Para copias en papel, contactos y documentación importante protegida del agua.", query: "funda documentos impermeable" },
    { icon: "03", title: "Manta térmica", text: "Ligera, compacta y útil como parte de una capa extra de abrigo.", query: "manta térmica emergencia" },
    { icon: "04", title: "Silbato de emergencia", text: "Una señal acústica simple y sin batería para llamar la atención si necesitas ayuda.", query: "silbato emergencia señalización" }
  ]
};

function amazonUrl(query) {
  const base = `https://www.amazon.es/s?k=${encodeURIComponent(query)}`;
  return PORTAL_CONFIG.amazonAffiliateTag ? `${base}&tag=${encodeURIComponent(PORTAL_CONFIG.amazonAffiliateTag)}` : base;
}

function renderProducts(category) {
  const grid = document.querySelector("#product-grid");
  grid.innerHTML = products[category].map((product, index) => `
    <a class="product-card product-card-link" data-product-name="${product.title}" data-product-category="${category}" href="${amazonUrl(product.query)}" target="_blank" rel="noopener sponsored">
      <span class="product-icon">${product.icon}</span>
      <h3>${product.title}</h3>
      <p>${product.text}</p>
      <div class="product-meta"><span>Selección ${String(index + 1).padStart(2, "0")}</span><span class="product-link">VER EN AMAZON ↗</span></div>
    </a>`).join("");
  observeProductImpressions();
}

document.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    startPlannerTracking();
    const input = document.getElementById(button.dataset.target);
    input.value = Math.min(Number(input.max), Math.max(Number(input.min), Number(input.value) + Number(button.dataset.step)));
    trackEvent("planner_quantity_changed", {
      field: button.dataset.target,
      direction: Number(button.dataset.step) > 0 ? "increase" : "decrease",
      value: Number(input.value)
    });
  });
});

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-category]").forEach((tab) => { tab.classList.remove("active"); tab.setAttribute("aria-selected", "false"); });
    button.classList.add("active"); button.setAttribute("aria-selected", "true"); renderProducts(button.dataset.category);
    trackEvent("product_category_selected", { category: button.dataset.category });
  });
});

document.querySelector("#pet").addEventListener("change", (event) => {
  startPlannerTracking();
  trackEvent("planner_option_changed", { option: "pet", selected: event.target.checked });
});

const plannerForm = document.querySelector("#planner-form");
plannerForm.addEventListener("focusin", () => {
  if (plannerCompleted && !plannerReturnTracked) {
    plannerReturnTracked = true;
    trackEvent("returned_to_planner");
  }
  startPlannerTracking();
});

plannerForm.addEventListener("invalid", (event) => {
  trackEvent("planner_validation_error", { field: event.target.id, validity: "out_of_range" });
}, true);

plannerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const adults = Number(document.querySelector("#adults").value);
  const children = Number(document.querySelector("#children").value);
  const pet = document.querySelector("#pet").checked;
  const mobility = document.querySelector("#mobility").checked;
  const people = adults + children;
  const household = `${people} ${people === 1 ? "persona" : "personas"}${pet ? " y una mascota" : ""}`;
  const picks = [
    { label: "PRIORIDAD 01", title: `Mochila de salida 25–30 L × ${people}`, text: "Una mochila por persona, ligera y ajustable. Es la base para tener lo imprescindible listo para moverlo.", query: "mochila senderismo 25 litros ligera" },
    { label: "PRIORIDAD 02", title: "Reserva de agua y filtro portátil", text: "Combina recipientes que puedas rotar con un filtro compacto como respaldo para cortes de suministro.", query: "garrafa agua potable almacenamiento filtro agua portátil emergencia" },
    { label: "PRIORIDAD 03", title: `Linterna frontal recargable × ${people}`, text: "La luz manos libres permite moverse, atender a otras personas y preparar el equipo sin depender de la red.", query: "linterna frontal recargable USB C" },
    { label: "PRIORIDAD 04", title: "Batería externa USB-C", text: "Elige una batería compatible con tus teléfonos y cables habituales. Cárgala y revísala con regularidad.", query: "batería externa 10000mAh USB C carga rápida" },
    { label: "PRIORIDAD 05", title: "Funda estanca para documentos", text: "Guarda copias, contactos y datos esenciales en un formato compacto y protegido de la humedad.", query: "funda documentos impermeable estanca" },
    { label: "PRIORIDAD 06", title: "Radio de emergencia", text: "Una radio con varias opciones de carga puede aportar información cuando las comunicaciones habituales no bastan.", query: "radio emergencia manivela solar" }
  ];
  if (children) picks.push({ label: "ADAPTADO A TU HOGAR", title: "Ponchos impermeables × " + people, text: "Una capa ligera y compacta para cada persona ayuda a mantener el abrigo durante un desplazamiento inesperado.", query: "poncho impermeable reutilizable adulto niño" });
  if (pet) picks.push({ label: "ADAPTADO A TU HOGAR", title: "Kit de viaje para mascota", text: "Incluye un recipiente plegable, correa y espacio para agua y comida. Adáptalo a la especie y sus necesidades.", query: "kit viaje mascota cuenco plegable" });
  if (mobility) picks.push({ label: "ADAPTADO A TU HOGAR", title: "Organizador de cuidados personales", text: "Un estuche visible para documentación y artículos personales. Completa cualquier necesidad sanitaria con orientación profesional.", query: "organizador medicación viaje estuche" });
  document.querySelector("#result-title").innerHTML = "ESTOS SON TUS<br /><em>PRIMEROS IMPRESCINDIBLES.</em>";
  document.querySelector("#result-summary").textContent = `Hemos priorizado ${picks.length} compras para ${household}. Empieza por las tres primeras: resuelven transporte, agua y luz.`;
  const recommendations = document.querySelector("#checklist");
  recommendations.className = "recommendation-grid";
  recommendations.innerHTML = picks.map((pick, index) => `<a class="recommendation-card ${index < 3 ? "is-priority" : ""}" href="${amazonUrl(pick.query)}" target="_blank" rel="noopener sponsored"><div class="recommendation-top"><span>${pick.label}</span><strong>${String(index + 1).padStart(2, "0")}</strong></div><div><h3>${pick.title}</h3><p>${pick.text}</p></div><span class="buy-link">VER EN AMAZON <span>↗</span></span></a>`).join("");
  const resultAction = document.querySelector("#result-action");
  resultAction.href = "#esenciales";
  resultAction.innerHTML = "VER TODO EL EQUIPO <span>→</span>";
  const result = document.querySelector("#result");
  result.classList.remove("hidden");
  plannerCompleted = true;
  trackEvent("planner_completed", {
    household_size: people,
    includes_children: children > 0,
    includes_pet: pet,
    recommendation_count: picks.length
  });
  trackEvent("recommendations_shown", { recommendation_count: picks.length });
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  if (link.matches(".product-card-link, .recommendation-card")) {
    const productName = link.dataset.productName || link.querySelector("h3")?.textContent?.trim();
    trackEvent("affiliate_product_clicked", {
      placement: link.matches(".recommendation-card") ? "planner_recommendation" : "product_catalog",
      product_name: productName,
      product_category: link.dataset.productCategory || "personalized"
    });
    if (link.matches(".recommendation-card")) {
      trackEvent("recommendation_clicked", { product_name: productName });
    }
    return;
  }

  if (link.matches(".button, .header-cta, .ghost-link, .why-action")) {
    trackEvent("cta_clicked", {
      cta_label: link.textContent.trim().replace(/\s+/g, " ").slice(0, 100),
      destination: link.hash ? link.hash.slice(1) : link.hostname
    });
  }

  if (link.hostname && link.hostname !== window.location.hostname) {
    trackEvent("outbound_resource_clicked", {
      destination_domain: link.hostname,
      source_type: link.hostname === "commission.europa.eu" ? "official_eu" : "external",
      link_label: link.textContent.trim().replace(/\s+/g, " ").slice(0, 100)
    });
    return;
  }

  if (link.hash) {
    trackEvent("section_navigation_clicked", {
      destination: link.hash.slice(1),
      link_label: link.textContent.trim().replace(/\s+/g, " ").slice(0, 100)
    });
  }
});

const viewedSections = new Set();
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || viewedSections.has(entry.target.id)) return;
    viewedSections.add(entry.target.id);
    trackEvent("section_viewed", { section: entry.target.id });
    sectionObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll("#plan, #result, #esenciales, #blog, #guia").forEach((section) => sectionObserver.observe(section));

const seenProducts = new Set();
const productObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const product = entry.target;
    const productId = `${product.dataset.productCategory}:${product.dataset.productName}`;
    if (!seenProducts.has(productId)) {
      seenProducts.add(productId);
      trackEvent("product_impression", {
        product_name: product.dataset.productName,
        product_category: product.dataset.productCategory
      });
    }
    productObserver.unobserve(product);
  });
}, { threshold: 0.5 });

function observeProductImpressions() {
  document.querySelectorAll(".product-card-link").forEach((product) => productObserver.observe(product));
}

const sectionEntryTimes = new Map();
const sectionDurationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const section = entry.target.id;
    if (entry.isIntersecting) {
      sectionEntryTimes.set(section, Date.now());
      return;
    }
    const enteredAt = sectionEntryTimes.get(section);
    if (!enteredAt) return;
    const durationSeconds = Math.round((Date.now() - enteredAt) / 1000);
    sectionEntryTimes.delete(section);
    if (durationSeconds >= 5) trackEvent("section_dwell_time", { section, duration_seconds: durationSeconds });
  });
}, { threshold: 0.5 });

document.querySelectorAll("#plan, #result, #esenciales, #blog, #guia").forEach((section) => sectionDurationObserver.observe(section));

const scrollMilestones = [25, 50, 75, 100];
const reachedScrollMilestones = new Set();
function trackScrollDepth() {
  const maxScrollable = document.documentElement.scrollHeight - window.innerHeight;
  const depth = maxScrollable > 0 ? ((window.scrollY / maxScrollable) * 100) : 100;
  scrollMilestones.forEach((milestone) => {
    if (depth < milestone || reachedScrollMilestones.has(milestone)) return;
    reachedScrollMilestones.add(milestone);
    trackEvent("scroll_depth", { percent: milestone });
  });
}

window.addEventListener("scroll", trackScrollDepth, { passive: true });
window.addEventListener("pagehide", () => {
  if (plannerStarted && !plannerCompleted) trackEvent("planner_abandoned");
});

const mobileTabs = document.querySelector(".essentials .category-tabs");
const essentialsSection = document.querySelector(".essentials");
const mobileBreakpoint = window.matchMedia("(max-width: 850px)");

if (mobileTabs && essentialsSection) {
  const tabsPlaceholder = document.createElement("div");
  tabsPlaceholder.className = "category-tabs-placeholder";
  mobileTabs.before(tabsPlaceholder);

  let stickyFrame = null;
  function updateMobileTabs() {
    stickyFrame = null;
    if (!mobileBreakpoint.matches) {
      mobileTabs.classList.remove("is-fixed");
      mobileTabs.classList.remove("is-bottom");
      tabsPlaceholder.style.height = "";
      return;
    }

    const tabsHeight = mobileTabs.getBoundingClientRect().height;
    const tabsStart = tabsPlaceholder.getBoundingClientRect().top + window.scrollY;
    const tabsEnd = essentialsSection.getBoundingClientRect().bottom + window.scrollY - tabsHeight;
    const shouldFix = window.scrollY >= tabsStart && window.scrollY < tabsEnd;
    const shouldPinBottom = window.scrollY >= tabsEnd;

    mobileTabs.classList.toggle("is-fixed", shouldFix);
    mobileTabs.classList.toggle("is-bottom", shouldPinBottom);
    tabsPlaceholder.style.height = shouldFix || shouldPinBottom ? `${tabsHeight}px` : "";
  }

  function requestMobileTabsUpdate() {
    if (stickyFrame) return;
    stickyFrame = requestAnimationFrame(updateMobileTabs);
  }

  window.addEventListener("scroll", requestMobileTabsUpdate, { passive: true });
  window.addEventListener("resize", requestMobileTabsUpdate);
  mobileBreakpoint.addEventListener("change", requestMobileTabsUpdate);
  requestMobileTabsUpdate();
}

renderProducts("agua");
