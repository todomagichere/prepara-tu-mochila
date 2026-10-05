/* Identificador de seguimiento para los enlaces de producto. */
const PORTAL_CONFIG = { amazonAffiliateTag: "lzr0ab-21" };

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
    <a class="product-card product-card-link" href="${amazonUrl(product.query)}" target="_blank" rel="noopener sponsored">
      <span class="product-icon">${product.icon}</span>
      <h3>${product.title}</h3>
      <p>${product.text}</p>
      <div class="product-meta"><span>Selección ${String(index + 1).padStart(2, "0")}</span><span class="product-link">VER EN AMAZON ↗</span></div>
    </a>`).join("");
}

document.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    input.value = Math.min(Number(input.max), Math.max(Number(input.min), Number(input.value) + Number(button.dataset.step)));
  });
});

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-category]").forEach((tab) => { tab.classList.remove("active"); tab.setAttribute("aria-selected", "false"); });
    button.classList.add("active"); button.setAttribute("aria-selected", "true"); renderProducts(button.dataset.category);
  });
});

document.querySelector("#planner-form").addEventListener("submit", (event) => {
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
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});

renderProducts("agua");
