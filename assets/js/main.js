const translations = {
  en_US: {
    brandName: "Djubi Player",
    brandTagline: "Native IPTV for Apple platforms",
    navHome: "Home",
    navScreenshots: "Screenshots",
    navDownloads: "Download",
    navWeb: "Web",
    navFaq: "FAQ",
    navPrivacy: "Privacy",
    navSupport: "Support",
    footerText: "Djubi Player. Built for Apple users.",
    ctaDownload: "Download app",
    ctaScreens: "View all screens"
  },
  pt_PT: {
    brandName: "Djubi Player",
    brandTagline: "IPTV nativo para plataformas Apple",
    navHome: "Início",
    navScreenshots: "Capturas",
    navDownloads: "Transferir",
    navWeb: "Web",
    navFaq: "FAQ",
    navPrivacy: "Privacidade",
    navSupport: "Suporte",
    footerText: "Djubi Player. Criado para utilizadores Apple.",
    ctaDownload: "Transferir app",
    ctaScreens: "Ver todas as capturas"
  }
};

const defaultLocale = navigator.language.toLowerCase().startsWith("pt") ? "pt_PT" : "en_US";
let locale = localStorage.getItem("djubi_locale") || defaultLocale;
if (!translations[locale]) locale = "en_US";

function t(key) {
  return translations[locale][key] || translations.en_US[key] || key;
}

function applyTranslations() {
  document.documentElement.lang = locale === "pt_PT" ? "pt-PT" : "en-US";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-lang]").forEach((node) => {
    node.hidden = node.dataset.lang !== locale;
  });

  document.querySelectorAll("[data-src-en][data-src-pt]").forEach((node) => {
    const source = locale === "pt_PT" ? node.dataset.srcPt : node.dataset.srcEn;
    if (source) node.src = source;
  });

  document.querySelectorAll('.lang-switch button[data-locale]').forEach((button) => {
    button.classList.toggle("active", button.dataset.locale === locale);
  });
}

function setLocale(nextLocale) {
  locale = translations[nextLocale] ? nextLocale : "en_US";
  localStorage.setItem("djubi_locale", locale);
  applyTranslations();
}

function bindLocaleButtons() {
  document.querySelectorAll('.lang-switch button[data-locale]').forEach((button) => {
    button.addEventListener("click", () => setLocale(button.dataset.locale));
  });
}

function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const overlay = document.getElementById("mobileOverlay");
  if (!toggle || !overlay) return;

  const openMenu = () => {
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    if (overlay.classList.contains("is-open")) closeMenu();
    else openMenu();
  });

  overlay.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeMenu();
  });
}

function setupRevealAnimations() {
  const nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.getAttribute("data-reveal-delay") || 0);
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
  );

  nodes.forEach((node) => observer.observe(node));
}

document.addEventListener("DOMContentLoaded", () => {
  bindLocaleButtons();
  applyTranslations();
  setupMobileMenu();
  setupRevealAnimations();
});
