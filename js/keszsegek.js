/* ============================================
   OverBitCore – Készségek / Skills Data
   ============================================ */

/*
  MINI TUTORIAL – új készség felvétele
  1. Másold ki egy egész #region blokkot (a kapcsos zárójával együtt).
  2. id legyen egyedi, ékezet nélkül: "aseprite".
  3. icon: ICON.aseprite. Az SVG-t az ICON objektumba tedd, fill="currentColor",
     hogy a téma színét örökölje, ne egy beleégetett fehéret.
  4. title és description kötelezően hu ÉS en. Ha az en hiányzik, angolra váltva üres a kártya.
  5. link: a Letöltés gomb célja. null vagy hagyd ki, ha nincs gomb.
  A feliratot a main.js renderSkills() rakja ki. Ide szöveget írni elég, i18n-t ehhez nem kell.
*/

const ICON = {
  unity: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12.9288 4.2939 3.7997 2.1929c.1366.077.1415.2905 0 .3675l-4.515 2.6076a.4192.4192 0 0 1-.4246 0L7.274 6.8543c-.139-.0745-.1415-.293 0-.3675l3.7972-2.193V0L1.3758 5.5977V16.793l3.7177-2.1456v-4.3858c-.0025-.1565.1813-.2682.318-.1838l4.5148 2.6076a.4252.4252 0 0 1 .2136.3676v5.2127c.0025.1565-.1813.2682-.3179.1838l-3.7996-2.1929-3.7178 2.1457L12 24l9.6954-5.5977-3.7178-2.1457-3.7996 2.1929c-.1341.082-.3229-.0248-.3179-.1838V13.053c0-.1565.087-.2956.2136-.3676l4.5149-2.6076c.134-.082.3228.0224.3179.1838v4.3858l3.7177 2.1456V5.5977L12.9288 0Z"/></svg>`,
 
  blender: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.028 2.005.045.823-.285 1.586-.865 2.153a3.389 3.389 0 0 1-2.374.938 3.393 3.393 0 0 1-2.376-.938c-.58-.567-.91-1.33-.865-2.152M7.35 14.831c.006.314.106.922.256 1.398a7.372 7.372 0 0 0 1.593 2.757 8.227 8.227 0 0 0 2.787 2.001 8.947 8.947 0 0 0 3.66.76 8.964 8.964 0 0 0 3.657-.772 8.285 8.285 0 0 0 2.785-2.01 7.428 7.428 0 0 0 1.592-2.762 6.964 6.964 0 0 0 .25-3.074 7.123 7.123 0 0 0-1.016-2.779 7.764 7.764 0 0 0-1.852-2.043h.002L13.566 2.55l-.02-.015c-.492-.378-1.319-.376-1.86.002-.547.382-.609 1.015-.123 1.415l-.001.001 3.126 2.543-9.53.01h-.013c-.788.001-1.545.518-1.695 1.172-.154.665.38 1.217 1.2 1.22V8.9l4.83-.01-8.62 6.617-.034.025c-.813.622-1.075 1.658-.563 2.313.52.667 1.625.668 2.447.004L7.414 14s-.069.52-.063.831zm12.09 1.741c-.97.988-2.326 1.548-3.795 1.55-1.47.004-2.827-.552-3.797-1.538a4.51 4.51 0 0 1-1.036-1.622 4.282 4.282 0 0 1 .282-3.519 4.702 4.702 0 0 1 1.153-1.371c.942-.768 2.141-1.183 3.396-1.185 1.256-.002 2.455.41 3.398 1.175.48.391.87.854 1.152 1.367a4.28 4.28 0 0 1 .522 1.706 4.236 4.236 0 0 1-.239 1.811 4.54 4.54 0 0 1-1.035 1.626"/></svg>`,
 
  visualStudio: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" ><path fill-rule="evenodd" clip-rule="evenodd" d="m21.292 4.103-4.118-1.98a1.232 1.232 0 0 0-.489-.121L16.643 2h-.036a1.248 1.248 0 0 0-.862.364L7.869 9.55 4.437 6.947a.83.83 0 0 0-1.064.047L2.272 7.995A.83.83 0 0 0 2 8.607v.004c0 .225.09.451.272.616l2.976 2.715-2.976 2.715a.834.834 0 0 0 .001 1.232l1.101 1.001a.828.828 0 0 0 1.065.047l3.432-2.603 7.876 7.186a1.24 1.24 0 0 0 .764.358l.012.001c.018.002.037.002.055.003.025.001.05.002.075.001l.027-.001c.169-.006.337-.045.496-.122l4.118-1.98c.431-.207.706-.645.706-1.125V5.229c0-.481-.275-.918-.708-1.126zm-4.298 12.369-5.972-4.531 5.972-4.531v9.062z"/></svg>',
  
  photoshop: '<svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M3.556 2.845v27.071h27.53V2.845zm25.34 24.918H5.745V4.998h23.151z"/><path fill="currentColor" d="M16.555 10.442c-.693-.599-1.726-.939-3.173-.939-1.433 0-3.173.046-3.173.046v11.103h2.326v-3.568s.407-.005.847-.023c1.593-.067 2.526-.549 3.327-1.364.616-.631.955-1.53.955-2.627s-.447-2.062-1.109-2.628m-3.235 4.673c-.375.004-.533.016-.786-.008v-3.834s.493-.017.971 0c1.198.044 1.833.89 1.833 1.921 0 1.148-.77 1.906-2.018 1.921m8.885.34c-1.005-.356-1.324-.559-1.324-.949 0-.423.352-.677.972-.677.703 0 1.767.454 2.136.658v-1.871c-.502-.254-1.265-.566-2.22-.566-2.027 0-3.334 1.169-3.334 2.728-.017.965.636 1.655 2.329 2.231.955.322 1.206.767 1.206 1.191s-.318.695-1.089.695c-.754 0-1.86-.431-2.329-.718v1.847c.62.338 1.518.659 2.329.684 2.363.074 3.551-1.152 3.551-2.694-.017-1.22-.67-2.016-2.228-2.558z"/></svg>',
  
  audacity: '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"><path d="M244.78 163.097c-9.051 22.654-17.77 60.147-28.3 17.016-7.899-30.635-24.773 19.194-37.043 27.74-24.749 18.812-38.447 45.324-49.439 73.727-29.108-24.75-18.191 14.973-19.975 34.4 1.586 29.12-3.16 60.963 2.344 88.4 23.096 20.129 39.808 51.897 74.18 51.486 23.51 8.171 20.567-27.38 41.887 2.123 19.616 26.892 31.732 11.165 44.543-2.063 18.712 28.647 24.445-34.274 40.23-6.053 24.398 9.497 46.274 14.014 50.279-18.188 5.01-25.432 48.736-25.948 38.49-56.525-1.428-31.725 2.837-65.714-2.095-96.046-16.562-12.925-29.337-42.771-48.207-45.371-23.349 11.33-14.35-38.626-23.96-53.326-3.14-38.61-11.41-21.151-20.401 5.322-4.975 38.12-25.886 19.948-36.57-4.998-9.5-7.99-20.33-50.197-25.964-17.644z" fill="none"/><g transform="matrix(3.94531 0 0 3.94536 3.5 -3.595)"><clipPath id="prefix__a"><path d="M30 94l2 2 3 10 1-12 3 15V90l2 5 3 14V90l2 2 3 17 3-23 6.616 25.92L59 96l2-6 2 25 6-25 2 21 5-22 5 24 1-18 3-6 1 23 5-22 3 10 1-9 3 6V78l-3 8-1-17-2 13-2-4-1-14-5 19-1-4-3-30-3 26-2 8-4-27-4 23-2 6-1-41.305L58 90l-6-42-3 36-2-4-2-24-1 24-3 7-2-24-2 19-3-5v14l-4-15v18z"/></clipPath><g clip-path="url(#prefix__a)"><path fill="currentColor" d="M28 43h72v73H28z"/><path d="M29 80l8 5 3-9 5 6 6-10 2 12 2-8 3 6 1-6s3 8 3 7 4-15 4-15l4 13 6-12 3 13 5-9 3 9 5-5 6 6v8l-4 3-6-2-4-2-1 10-2-10-4 9-6-9-2 9-4-6-5 13-3-15-6 3-4-6-2 10-4-5-4 5-2-3-6 1V80z" fill="currentColor"/></g></g><g transform="matrix(3.94531 0 0 3.94536 3.5 12.186)"><clipPath id="prefix__b"><path d="M64 6.875c-13.263 0-25.359 4.141-34.281 11.094C20.796 24.922 15 34.87 15 45.938v4C6.141 54.426 0 66.2 0 80c0 17.664 10.049 32 23 32V45.938c0-8.289 4.29-15.916 11.656-21.657 7.367-5.74 17.769-9.406 29.344-9.406 11.575 0 21.977 3.666 29.344 9.406C100.71 30.022 105 37.649 105 45.938V112c12.951 0 23-14.336 23-32 0-13.8-6.141-25.574-15-30.062v-4c0-11.068-5.796-21.016-14.719-27.969C89.359 11.016 77.263 6.875 64 6.875zM26 49v63c2 0 4-1 5-3V51c-1-1-3-2-5-2zm76 0c-2 0-4 1-5 2v58c1 2 3 3 5 3V49z"/></clipPath><g clip-path="url(#prefix__b)" fill="currentColor" fill-rule="nonzero"><path d="M64 6.875c-13.263 0-25.359 4.141-34.281 11.094C20.796 24.922 15 34.87 15 45.938v4C6.141 54.426 0 66.2 0 80c0 17.664 10.049 32 23 32V45.938c0-8.289 4.29-15.916 11.656-21.657 7.367-5.74 17.769-9.406 29.344-9.406 11.575 0 21.977 3.666 29.344 9.406C100.71 30.022 105 37.649 105 45.938V112c12.951 0 23-14.336 23-32 0-13.8-6.141-25.574-15-30.062v-4c0-11.068-5.796-21.016-14.719-27.969C89.359 11.016 77.263 6.875 64 6.875z"/><path d="M26 49v63c2 0 4-1 5-3V51c-1-1-3-2-5-2zM102 49c-2 0-4 1-5 2v58c1 2 3 3 5 3V49z"/></g></g></svg>',

  gimp: '<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>gimp</title><path d="m19.696 17.755-.916.451.075.062.247.196 2.511 2.022q1.205.964 2.439 1.891a.7.7 0 0 0-.01.161v-.002l.325-.05.129.19 2.895 1.839a2.47 2.47 0 0 0 .265 1.832l-.006-.012a6.62 6.62 0 0 0 3.299 2.602l.046.014c-.963-2.459-.261-4.46-2.162-5.165a1.15 1.15 0 0 0-.794-.039l.008-.002-2.558-2.368-.217-.065-.031-.327a1 1 0 0 0-.155.076l.005-.003a17 17 0 0 0-1.362-1.018c-1.704-1.043-2.82-1.625-4.034-2.287zm.688-.125q-.09.099-.192.181l-.003.003.262.144a2 2 0 0 0-.071-.343zm-10.322-6.204a1.05 1.05 0 1 0 .913.51l.003.005a1.05 1.05 0 0 0-.903-.514zh.001zm-6.947-.153h.031c.331 0 .631.132.851.347.218.213.352.509.352.838s-.135.625-.353.838a1.215 1.215 0 0 1-1.703-.002 1.17 1.17 0 0 1-.011-1.665c.214-.215.507-.35.832-.358h.001zm13.674-.799h-.001a1.656 1.656 0 1 0 1.431.821l.004.008a1.66 1.66 0 0 0-1.433-.829zm-7.218-.602.077-.001c1.243 0 2.256.985 2.3 2.218v.004a2.304 2.304 0 0 1-2.301 2.219l-.081-.001h.004l-.076.001a2.3 2.3 0 0 1-2.298-2.215v-.004a2.304 2.304 0 0 1 2.378-2.222zm16.236-6.823c-.132-.02-.285.134-.405.496-.196.587-1.341 4.003-6.878 5.406.74.62 1.21 1.54 1.22 2.571v.002a3.63 3.63 0 0 1-3.755 3.499h.006l-.118.002a3.63 3.63 0 0 1-3.628-3.494v-.007a3.3 3.3 0 0 1 .699-2.027l-.006.008a7.49 7.49 0 0 1-5.591-3.863l-.02-.04-.12 5.202a4.8 4.8 0 0 1-.349 2.077l.012-.032-.063-.09a5.5 5.5 0 0 0-1.643-1.525l-.025-.014a3.54 3.54 0 0 0-1.87-.528h-.024.001c-.476.01-.913.164-1.273.422l.007-.005a2.62 2.62 0 0 0-.981 2.224v-.008a5.15 5.15 0 0 0 1.027 2.914l-.01-.013a5.4 5.4 0 0 0 1.939 1.685l.03.014a3.13 3.13 0 0 0 2.164.283l-.021.004c3.745 2.774 10.599 5.184 15.284 2.356l-2.53-2.036a8.6 8.6 0 0 1-2.19.278 8.7 8.7 0 0 1-3.363-.668l.058.021c.712.235 1.531.37 2.381.37a7.8 7.8 0 0 0 4.314-1.29l-.029.018a3 3 0 0 0-.87-.65l-.017-.008c.456.101.85.319 1.163.621l-.001-.001c.17.218.273.495.273.796v.021-.001c.691.372 1.478.82 2.343 1.327 2.574-2.574 4.065-7.414 3.149-15.767-.044-.336-.159-.531-.291-.552z"/></svg>',
};


const SKILLS = [
  /* Unity */
  // #region unity
  {
    id: "unity",
    icon: ICON.unity,
    title: {
      hu: "Unity",
      en: "Unity"
    },
    // [MODOSÍTVA: 2026-08-20] - Kicserélve szigorúan szakmai, architektúra-központú leírásra.
    description: {
      hu: "Moduláris C# architektúrák fejlesztése, egyedi szerkesztőeszközök készítése és teljesítményoptimalizálás. Jelenleg a Pekka Kana 2 és a Heavy Metal F.A.K.K. 3 folytatásainak fejlesztéséhez használva.",
      en: "Developing modular C# architectures, custom editor tools, and performance-optimized game logic. Currently powering the development of the Pekka Kana 2 and Heavy Metal F.A.K.K. 2 sequels."
    },
    link: "https://unity.com/products/unity-personal",
  },
    /* Blender */
  // #endregion


  // #region blender
  {
    id: "blender",
    icon: ICON.blender,
    title: {
      hu: "Blender",
      en: "Blender"
    },
    // [MODOSÍTVA: 2026-08-20] - Fókusz a non-destructive workflow-ra és a textúra pipeline-ra.
    description: {
      hu: "Hatékony 3D modellezési munkafolyamatok, optimalizált retopológia és PBR textúrázás. Karakterek és környezeti elemek készítése a Unity motorhoz.",
      en: "Efficient 3D modeling workflows, optimized retopology, and PBR texturing. Creating character and environmental assets for the Unity engine."
    },
    link: "https://www.blender.org/download",
  },
    /* Visual Studio */
  // #endregion


  // #region visual-studio
  {
    id: "visual-studio",
    icon: ICON.visualStudio,
    title: {
      hu: "Visual Studio",
      en: "Visual Studio"
    },
    description: {
      hu: "Strukturált, moduláris kódbázisok építése. Tiszta kód elvek, hatékony hibakeresés és folyamatos kódrefaktorálás a karbantarthatóság érdekében.",
      en: "Building structured, modular codebases. Clean code principles, efficient debugging, and continuous code refactoring for maintainability."
    },
    link: "https://code.visualstudio.com/download",
  },
      /* Audacity */
  // #endregion


  // #region audacity
  {
    id: "audacity",
    icon: ICON.audacity,
    title: {
      hu: "Audacity",
      en: "Audacity"
    },
    // [MODOSÍTVA: 2026-08-20] - Spektrumanalízis és game audio mastering hozzáadva.
    description: {
      hu: "Hangeffektek szerkesztése, zajszűrés és utómunka. Játékon belüli hangok minőségének javítása és szerkesztése.",
      en: "Sound effect editing, noise reduction, and post-processing. Enhancing and editing in-game audio assets."
    },
    link: "https://www.audacityteam.org/download",
  },
     /* Photoshop */
  // #endregion


  // #region photoshop
  {
    id: "photoshop",
    icon: ICON.photoshop,
    title: {
      hu: "Photoshop",
      en: "Photoshop"
    },
    // [MODOSÍTVA: 2026-08-20] - Smart Object struktúrák és channel packing fókusz.
    description: {
      hu: "Rugalmas rétegkezelés, UI/UX elemek tervezése, valamint textúra- és csatorna-optimalizálás grafikai elemekhez.",
      en: "Flexible layer management, UI/UX element design, and texture channel optimization for graphical assets."
    },
    link: "https://www.adobe.com/products/photoshop",
  },
   /* GIMP */
  // #endregion


  // #region gimp
  {
    id: "gimp",
    icon: ICON.gimp,
    title: {
      hu: "GIMP",
      en: "GIMP"
    },
    // [MODOSÍTVA: 2026-08-20] - Automata batch processzálás és nyílt forráskódú rugalmasság hangsúlyozása.
    description: {
      hu: "Nyílt forráskódú eszköz gyors képjavításhoz, maszkoláshoz és kisebb grafikai módosításokhoz.",
      en: "Open-source tool for quick image enhancement, masking, and minor graphical modifications."
    },
    link: "https://www.gimp.org/downloads/",
  },
  // #endregion
];

window.SKILLS = SKILLS;
window.ICONS = ICON;
