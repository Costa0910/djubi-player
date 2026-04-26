/**
 * Djubi Player - Main JavaScript
 * Handles translations, mobile menu, and reveal animations
 */

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
    ctaDownload: "Download",
    ctaScreens: "View screenshots"
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
    ctaDownload: "Transferir",
    ctaScreens: "Ver capturas"
  }
};

// Determine initial locale based on browser language
const defaultLocale = navigator.language.toLowerCase().startsWith("pt") ? "pt_PT" : "en_US";
let locale = localStorage.getItem("djubi_locale") || defaultLocale;
if (!translations[locale]) locale = "en_US";

/**
 * Get translation for a key
 */
function t(key) {
  return translations[locale][key] || translations.en_US[key] || key;
}

/**
 * Apply all translations to the page
 */
function applyTranslations() {
  document.documentElement.lang = locale === "pt_PT" ? "pt-PT" : "en-US";

  // Translate elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  // Show/hide elements based on language
  document.querySelectorAll("[data-lang]").forEach((node) => {
    node.hidden = node.dataset.lang !== locale;
  });

  // Swap image sources based on language
  document.querySelectorAll("[data-src-en][data-src-pt]").forEach((node) => {
    const source = locale === "pt_PT" ? node.dataset.srcPt : node.dataset.srcEn;
    if (source) node.src = source;
  });

  // Update language switch button states
  document.querySelectorAll('.lang-switch button[data-locale]').forEach((button) => {
    button.classList.toggle("active", button.dataset.locale === locale);
  });
}

/**
 * Set the current locale and update UI
 */
function setLocale(nextLocale) {
  locale = translations[nextLocale] ? nextLocale : "en_US";
  localStorage.setItem("djubi_locale", locale);
  applyTranslations();
}

/**
 * Bind click handlers to language switch buttons
 */
function bindLocaleButtons() {
  document.querySelectorAll('.lang-switch button[data-locale]').forEach((button) => {
    button.addEventListener("click", () => setLocale(button.dataset.locale));
  });
}

/**
 * Setup mobile menu functionality
 */
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
    if (overlay.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking on links
  overlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu when clicking outside
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeMenu();
  });

  // Close menu on escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeMenu();
    }
  });

  // Close menu on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeMenu();
  });
}

/**
 * Setup intersection observer for reveal animations
 */
function setupRevealAnimations() {
  const nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    nodes.forEach((node) => node.classList.add("in-view"));
    return;
  }

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
    { 
      threshold: 0.15, 
      rootMargin: "0px 0px -60px 0px" 
    }
  );

  nodes.forEach((node) => observer.observe(node));
}

/**
 * Initialize when DOM is ready
 */
document.addEventListener("DOMContentLoaded", () => {
  bindLocaleButtons();
  applyTranslations();
  setupMobileMenu();
  setupRevealAnimations();
});
