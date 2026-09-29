/* ============================================
   OverBitCore – Internationalization
   Modular translation system
   ============================================ */

/*
  MINI TUTORIAL – új felirat
  A kulcs egyezzen a HTML data-i18n értékével. Példa:
    HTML: <span data-i18n="hero.badge">
    itt:  "hero.badge": "..."  a hu ÉS az en objektumban is.
  Placeholderhez data-i18n-placeholder és ugyanilyen kulcs.
  Ha csak az egyik nyelvbe írod, a másik nyelv a HTML-ben hagyott tartalék szöveget mutatja.
  A készség- és projektkártya szövege NEM itt van, hanem keszsegek.js / projektek.js.
*/

// #region translations
const translations = {
hu: {
    "nav.about": "Rólam",
    "nav.projects": "Projektek",
    "nav.skills": "Tech Stack", 
    "nav.contact": "Kapcsolat",

    "hero.badge": "Indie Játékfejlesztő & 3D Artist",
    "hero.tagline": "Klasszikusok modern motorokban, szenvedéllyel építve.",
    "hero.desc": "Önálló fejlesztőként a programozás és a vizuális dizájn határán dolgozom. Célom, hogy maradandó élményeket hozzak létre modern technológiákkal.",
    "hero.ctaProjects": "Munkáim",
    "hero.ctaContact": "Kapcsolat",

    "about.label": "Rólam",
    "about.title": "A fejlesztő a képernyő mögött", 

    "projects.label": "Portfólió",
    "projects.title": "Kiemelt projektek",
    "projects.desc": "Eddigi munkáim és fejlesztés alatt álló játékaim gyűjteménye.",

    "skills.label": "Tech Stack",
    "skills.title": "Eszközök és technológiák",

    "contact.label": "Kapcsolat",
    "contact.title": "Lépjünk kapcsolatba",
    "contact.desc": "Keress bátran kérdésekkel, projektekkel vagy együttműködési lehetőségekkel kapcsolatban.",
    "contact.name": "Név",
    "contact.namePlaceholder": "Az Ön neve",
    "contact.email": "Email",
    "contact.emailPlaceholder": "pelda@email.hu",
    "contact.message": "Üzenet",
    "contact.messagePlaceholder": "Írja ide az üzenetet...",
    "contact.send": "Küldés",
    "contact.infoTitle": "Elérhetőségek",
    "contact.infoText": "Az alábbi űrlapon vagy közvetlen e-mailben is felveheti velem a kapcsolatot.",
    "contact.success": "Köszönöm! Az üzenet sikeresen elküldve.",
    "contact.error": "Kérjük, töltsön ki minden mezőt helyesen.", 

    "footer.rights": "Minden jog fenntartva.",
    "footer.made": "Modern webes technológiákkal és gondossággal készítve."
  },

  en: {
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.skills": "Tech Stack",
    "nav.contact": "Contact",

    "hero.badge": "Indie Game Developer & 3D Artist",
    "hero.tagline": "Reviving classics and building new worlds.",
    "hero.desc": "Solo developer working at the intersection of programming and visual design. Focused on creating engaging experiences with modern engines.",
    "hero.ctaProjects": "View Projects",
    "hero.ctaContact": "Get in Touch",

    "about.label": "About",
    "about.title": "The developer behind the screen",

    "projects.label": "Portfolio",
    "projects.title": "Featured Projects",
    "projects.desc": "A collection of my past work and games currently in development.",

    "skills.label": "Tech Stack",
    "skills.title": "Tools and Technologies",

    "contact.label": "Contact",
    "contact.title": "Let's Connect",
    "contact.desc": "Feel free to reach out for questions, projects, or collaboration opportunities.",
    "contact.name": "Name",
    "contact.namePlaceholder": "Your Name",
    "contact.email": "Email",
    "contact.emailPlaceholder": "you@example.com",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Type your message here...",
    "contact.send": "Send Message",
    "contact.infoTitle": "Contact Info",
    "contact.infoText": "You can reach out using the form or directly via email.",
    "contact.success": "Thank you! Your message has been sent.",
    "contact.error": "Please fill in all required fields correctly.",

    "footer.rights": "All rights reserved.",
    "footer.made": "Built with modern web standards and care."
  }
};
// #endregion


// #region setLanguage
function setLanguage(lang) {
  if (!translations[lang]) return;

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });

  localStorage.setItem('overbitcore-lang', lang);
}
// #endregion


// #region initI18n
function initI18n() {
  const saved = localStorage.getItem('overbitcore-lang');
  const browserLang = navigator.language?.startsWith('hu') ? 'hu' : 'en';
  const initialLang = saved || browserLang || 'hu';

  setLanguage(initialLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
}

window.OverBitI18n = { setLanguage, initI18n, translations };
// #endregion
