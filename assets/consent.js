(() => {
  const analyticsId = "G-69HHQKVEXY";
  const consentKey = "72h-listo-cookie-consent";
  const consentDuration = 180 * 24 * 60 * 60 * 1000;
  const banner = document.querySelector("#cookie-banner");
  const panel = document.querySelector("#cookie-panel");
  const analyticsToggle = document.querySelector("#analytics-consent");
  let lastFocusedElement;

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

  function deleteAnalyticsCookies() {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.trim().split("=")[0];
      if (name === "_ga" || name.startsWith("_ga_")) {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      }
    });
  }

  function updateAnalyticsConsent(value) {
    const granted = value === "accepted";
    window.cookieAnalyticsGranted = granted;
    if (typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    if (granted) {
      window.gtag("config", analyticsId, { anonymize_ip: true, send_page_view: true });
    } else {
      deleteAnalyticsCookies();
    }
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
    updateAnalyticsConsent(value);
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

  const storedConsent = readConsent();
  if (storedConsent) updateAnalyticsConsent(storedConsent);
  else {
    window.cookieAnalyticsGranted = false;
    banner.hidden = false;
  }
})();
