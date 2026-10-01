/* ============================================
   OverBitCore – Projektek / Projects Data
   ============================================ */

/*
  MINI TUTORIAL – új projekt
  Másolj egy #region blokkot, és töltsd:
    id            egyedi, ékezet nélkül
    title         { hu, en }
    description   { hu, en }
    tags          tömb, pl. ["Unity", "3D"]
    status        a pötty. Ezt switcheled, a feliratot nem ez írja:
                  "completed"       zöld, nem villog (kész)
                  "beta"            sárga, nem villog
                  "beta-playable"   sárga, villog (kipróbálható béta)
                  "alpha"           piros, nem villog
                  "alpha-playable"  piros, villog (kipróbálható alfa)
                  "in-development"  szürke, nem villog
    statusText    { hu, en }  amit a pont mellé ír, a színtől független
    image         "img/project/valami.png"  a WebSite mappához képest
    downloadLink  itch/steam url, vagy null ha nincs Letöltés
    watchHtml     trailer url, vagy null ha nincs Nézd meg
    year          szám
  A kártyát a main.js renderProjects() építi. Itt csak adat van.
*/


const PROJECTS = [
  // #region mindscape
  {
    id: "mindscape",
    title: {
      hu: "Mindscape",
      en: "Mindscape"
    },
    description: {
      hu: "Ebben az egyjátékos anomália-vadász élményben folyamatosan változó szobák sorát fedezheted fel, ahol mindegyik finom torzulásokat rejt. Tárgyak mozdulnak el, tűnnek el, vagy bukkannak fel ott, ahová nem valók — de nem minden anomália látható azonnal. A feladatod? Találd meg őket, mielőtt a valóság összeomlik.",
      en: "In this single-player anomaly-hunting experience, you'll explore an ever-shifting series of rooms, each hiding subtle distortions. Objects shift, vanish, or appear where they don't belong—but not all anomalies are immediately visible. Your task? Find them before reality collapses."
    },
    tags: ["Unity", "3D / Puzzle", "Horror"],
    status: "completed",
    statusText: {
      hu: "Elkészült",
      en: "Completed"
    },
    image: "img/project/mindscape.jpg",
    downloadLink: "https://overbitcore.itch.io/mindscape",
    watchHtml: null,
    year: 2026
  },
  // #endregion


  // #region paleFlame
  {
    id: "paleFlame",
    title: {
      hu: "Pale Flame",
      en: "Pale Flame"
    },
    description: {
      hu: "Egy kemény, módszeres harcra épülő akció-RPG egy romba dőlt birodalom romjai között. Minden halál tanulság, minden győzelem vérbe kerül. Fedezd fel az összefüggő világot, szembesülj istenné torzult lényekkel, és döntsd el a világ sorsát: helyreállítod a régi rendet, vagy hamujából újat építesz. Készülj fel rá — sokszor fogsz halni.",
      en: "A punishing action-RPG set among the ruins of a fallen empire, built on deliberate, methodical combat. Every death is a lesson, every victory paid in blood. Explore an interconnected world, face beings twisted into gods, and decide the fate of the world: restore the old order, or build a new one from the ashes. Prepare to die—often."
    },
    tags: ["Unity", "3D / Action-RPG", "Souls-Like", "Dark Fantasy"],
    status: "in-development", // [JAVÍTVA: Egységesített kisbetűs status elnevezés]
    statusText: {
      hu: "Fejlesztés Alatt",
      en: "In Development"
    },
    image: "img/project/paleFlame.png",
    downloadLink: null,
    watchHtml: null,
    year: 2026
  },
  // #endregion


  // #region corridorZero
  {
    id: "corridorZero",
    title: {
      hu: "Corridor Zero",
      en: "Corridor Zero"
    },
    description: {
      hu: "Éjszakai műszak egy földalatti kutatóbázison, ahol a folyosók sosem olyanok, mint emlékszel rá. Figyeld a részleteket: ha bármi másképp néz ki, mint az előző körben — fordulj vissza és zárd be magad mögött az ajtót. Ha nem veszed észre időben az anomáliát... a létesítmény észrevesz téged.",
      en: "Night shift in an underground research facility where the corridors are never quite how you remember them. Watch the details: if anything seems off from the previous loop—turn back and seal the door behind you. Fail to spot the anomaly in time... and the facility will notice you."
    },
    tags: ["Unity", "3D / Horror", "Anomaly Hunting", "Loop-Based"],
    status: "in-development", // [JAVÍTVA: Egységesített kisbetűs status elnevezés]
    statusText: {
      hu: "Fejlesztés Alatt",
      en: "In Development"
    },
    image: "img/project/corridorZero.png",
    downloadLink: null,
    watchHtml: null,
    year: 2026
  },
  // #endregion


  // #region kimiNoShirayuki
  {
    id: "kimiNoShirayuki",
    title: {
      hu: "Kimi no Shirayuki",
      en: "Kimi no Shirayuki"
    },
    description: {
      hu: "Átöltöztél egy új iskolába, és ő az első, aki mosolyog rád. Shirayuki tökéletes — kedves, szép, gondoskodó. Talán... túl gondoskodó. Amikor észreveszed, hogy a naplód lapjai eltűntek, a telefonod figyelve van, és a barátaid sorban tűnnek el, már késő. Rejtőzz el, oldj meg rejtvényeket, és menekülj — miközben végig hallod a hangját a folyosón. Nem a szörnytől menekülsz. Hanem valakitől, aki azt hiszi, szeretsz.",
      en: "You've transferred to a new school, and she's the first one to smile at you. Shirayuki is perfect—kind, beautiful, caring. Maybe... too caring. When pages go missing from your diary, your phone feels watched, and your friends start disappearing one by one, it's already too late. Hide, solve puzzles, and escape—while her voice echoes through the halls. You're not running from a monster. You're running from someone who believes she loves you."
    },
    tags: ["Unity", "3D / Horror", "Psychological", "Escape"],
    status: "alpha-playable", // [JAVÍTVA: Egységesített kisbetűs status elnevezés]
    statusText: {
      hu: "Fejlesztés Alatt",
      en: "In Development"
    },
    image: "img/project/kimiNoShirayuki.png",
    downloadLink: null,
    watchHtml: null,
    year: 2026
  },
  // #endregion


  // #region determination
  {
    id: "determination",
    title: {
      hu: "Determination",
      en: "Determination"
    },
    description: {
      hu: "Egy retro 2D-s RPG, ahol minden döntésed nyomot hagy. A régi legenda szerint aki felmászik a Fekete Csúcsra, sosem tér vissza.",
      en: "A retro 2D RPG carved by every choice you leave behind. Old tales whisper that those who dare scale the Black Peak are swallowed by the dark, never to return."
    },
    tags: ["Unity", "2D"],
    status: "in-development", // [JAVÍTVA: Egységesített kisbetűs status elnevezés]
    statusText: {
      hu: "Fejlesztés Alatt",
      en: "In Development"
    },
    image: "img/project/determination.png",
    downloadLink: null,
    watchHtml: null,
    year: 2026
  },
  // #endregion


  // #region cluckQuest
  {
    id: "cluckQuest",
    title: {
      hu: "Cluck Quest",
      en: "Cluck Quest"
    },
    description: {
      hu: "",
      en: ""
    },
    tags: ["Unity", "2D / Puzzle", "Platformer"],
    status: "in-development",
    statusText: {
      hu: "Fejlesztés Alatt",
      en: "In Development"
    },
    image: "img/project/cluckQuest.png",
    downloadLink: null,
    watchHtml: null,
    year: 2026
  },
  // #endregion

// #region the-board-takes
  {
    id: "the-board-takes",
    title: {
      hu: "The Board Takes",
      en: "The Board Takes"
    },
    description: {
      hu: "",
      en: ""
    },
    tags: ["Unity", "3D / Puzzle", "Horror"],
    status: "in-development",
    statusText: {
      hu: "Fejlesztés Alatt",
      en: "In Development"
    },
    image: "img/project/theBoardTakes.png",
    downloadLink: null,
    watchHtml: null,
    year: 2027
  }
// #endregion
];

window.PROJECTS = PROJECTS;
