/* ============================================
   OverBitCore – Rólam / About Data
   ============================================ */

/*
  MINI TUTORIAL – Rólam kártya
  Egy objektum = egy kártya. icon lehet emoji ("🎯") vagy egy SVG string.
  title és description: { hu, en }. Új kártyához másolj egy #region-t.
  A renderAbout() a main.js-ben olvassa. Sorrend = megjelenési sorrend.
*/


const ABOUT = [
  // #region mission
  {
    id: "mission",
    icon: "🎯",
    title: {
      hu: "Küldetés",
      en: "Mission"
    },
    description: {
      hu: "Minőségi indie játékok és szoftveres megoldások fejlesztése, amelyek ötvözik a retro hangulatot a modern technológiával.",
      en: "Developing quality indie games and software solutions that combine retro aesthetics with modern technology."
    }
  },
  // #endregion


  // #region craft
  {
    id: "craft",
    icon: "🛠️",
    title: {
      hu: "Fejlesztés & Design",
      en: "Development & Design"
    },
    description: {
      hu: "A tiszta kódírás és a 3D modellezés harmonikus egyensúlya a projektek minden fázisában.",
      en: "A balanced approach combining clean code practices and 3D modeling across all project phases."
    }
  },
  // #endregion


  // #region mindset
  {
    id: "mindset",
    icon: "⚡",
    title: {
      hu: "Szemléletmód",
      en: "Mindset"
    },
    description: {
      hu: "Strukturált felépítés, moduláris szemlélet és folyamatos szakmai fejlődés.",
      en: "Structured architecture, modular design, and continuous professional growth."
    }
  }
  // #endregion
];

window.ABOUT = ABOUT;
