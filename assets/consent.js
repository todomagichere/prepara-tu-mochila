(() => {
  const analyticsId = "G-69HHQKVEXY";
  const consentKey = "72h-listo-cookie-consent";
  const consentDuration = 180 * 24 * 60 * 60 * 1000;
  const banner = document.querySelector("#cookie-banner");
  const panel = document.querySelector("#cookie-panel");
  const analyticsToggle = document.querySelector("#analytics-consent");
  let lastFocusedElement;
  let analyticsLoaded = false;

  function readConsent() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(consentKey));
      if (!saved || !saved.updatedAt || Date.now() - saved.updatedAt > consentDuration) return null;
      return saved.value;
    } catch {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(consentKey, JSON.stringify({ value, updatedAt: Date.now() }));
    } catch {
      // Si el almacenamiento local no está disponible, se respeta la elección durante esta visita.
    }
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", analyticsId, { anonymize_ip: true });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    document.head.append(script);
  }

  function closePanel() {
    panel.hidden = true;
    document.body.classList.remove("cookie-panel-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function openPanel() {
    lastFocusedElement = document.activeElement;
    analyticsToggle.checked = readConsent() === "accepted";
    banner.hidden = true;
    panel.hidden = false;
    document.body.classList.add("cookie-panel-open");
    panel.querySelector(".cookie-close").focus();
  }

  function setConsent(value) {
    saveConsent(value);
    banner.hidden = true;
    closePanel();
    if (value === "accepted") loadAnalytics();
  }

  document.querySelectorAll("[data-cookie-settings]").forEach((button) => button.addEventListener("click", openPanel));
  document.querySelectorAll("[data-cookie-accept]").forEach((button) => button.addEventListener("click", () => setConsent("accepted")));
  document.querySelectorAll("[data-cookie-reject]").forEach((button) => button.addEventListener("click", () => setConsent("rejected")));
  document.querySelectorAll("[data-cookie-close]").forEach((button) => button.addEventListener("click", () => {
    closePanel();
    if (!readConsent()) banner.hidden = false;
  }));
  document.querySelector("[data-cookie-save]").addEventListener("click", () => {
    setConsent(analyticsToggle.checked ? "accepted" : "rejected");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
      if (!readConsent()) banner.hidden = false;
    }
  });

  if (readConsent() === "accepted") loadAnalytics();
  else if (!readConsent()) banner.hidden = false;
})();
