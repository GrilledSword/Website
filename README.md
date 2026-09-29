# OverBitCore – Personal portfolio site

Moduláris, bilingual (HU/EN) portfolio liquid glass dizájnnal és scroll-vezérelt 3D Core / reaktor háttérrel.

## Fájlok

| Fájl | Szerep |
|------|--------|
| `index.html` | Struktúra |
| `css/main.css` | Stílusok, téma, responsive |
| `js/parallax.js` | **3D háttér** (vertex → face → solid mesh) |
| `js/main.js` | Téma, rendererek, interakciók |
| `js/i18n.js` | Fordítások |
| `js/projektek.js` | Projektek adatai |
| `js/hivatkozasok.js` | Email + social linkek + SVG ikonok |
| `js/keszsegek.js` | Készségek |
| `js/rolam.js` | Rólam kártyák |

## Tartalom szerkesztése

- **Projektek** → `js/projektek.js`
- **Linkek / social** → `js/hivatkozasok.js`
- **Készségek** → `js/keszsegek.js`
- **Rólam** → `js/rolam.js`
- **Szövegek (HU/EN)** → `js/i18n.js`

## Futtatás

Nyisd meg az `index.html`-t, vagy:

```bash
cd overbitcore
python3 -m http.server 8080
```

Majd: http://localhost:8080

## Minitutorial – közeljövő

A tartalom adat, nem HTML. Egy új dolog felvétele mindig ugyanaz a minta: másolsz egy `#region` blokkot, `hu` és `en` szöveget adsz, frissítesz.

- Új készség: `js/keszsegek.js`. Ikon az `ICON` objektumba, `fill="currentColor"`. A Letöltés gomb a `link` mező.
- Új projekt: `js/projektek.js`. Kép útvonala a site gyökeréhez képest, pl. `img/project/valami.png`. `status`: `completed`, `concept`, `experimental`, `released`.
- Új rólam kártya: `js/rolam.js`. Sorrend = megjelenés.
- Új social: `js/hivatkozasok.js`. `enabled: false` elrejti.
- Új felirat a vázon (nav, hero, szekciócím): `js/i18n.js`, ugyanazzal a kulccsal, amit a HTML `data-i18n` hordoz. Mindkét nyelvbe.
- Szín: `css/main.css`, `--accent` / `--accent-2` / `--accent-3`.
- Kártyaszélesség: `.skills-grid` `minmax(320px, 1fr)`. Kisebb szám = több, keskenyebb kártya.

A `#region` / `#endregion` komment. A böngésző nem látja, a VS Code, a Cursor és a Rider összecsukja.
