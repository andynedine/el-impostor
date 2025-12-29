/* El Impostor - app.js (mejorado)
   - Jugadores persistentes
   - Nº de impostores configurable (1 .. floor(n/2))
   - Tema dark/light persistente
   - Hold-to-reveal animado
   - Palabras de 1 sola palabra
*/

const LS_PLAYERS_KEY = "impostor_players_v2";
const LS_THEME_KEY   = "impostor_theme_v1";
const LS_IMP_KEY     = "impostor_count_v1";

const $ = (sel) => document.querySelector(sel);

const screenSetup = $("#screenSetup");
const screenTurn  = $("#screenTurn");
const screenEnd   = $("#screenEnd");

const playerName = $("#playerName");
const btnAddPlayer = $("#btnAddPlayer");
const btnClearPlayers = $("#btnClearPlayers");
const playersList = $("#playersList");
const playersCount = $("#playersCount");
const btnStart = $("#btnStart");

const impostorCountSel = $("#impostorCount");

const btnBackToSetup = $("#btnBackToSetup");
const btnNext = $("#btnNext");
const btnFinish = $("#btnFinish");

const turnIndex = $("#turnIndex");
const turnTotal = $("#turnTotal");
const turnPlayer = $("#turnPlayer");
const roundCategory = $("#roundCategory");

const holdArea = $("#holdArea");
const secretLabel = $("#secretLabel");
const secretWord = $("#secretWord");
const secretBox = $("#secretBox");

const endCategory = $("#endCategory");
const endWord = $("#endWord");
const btnReveal = $("#btnReveal");
const revealResult = $("#revealResult");
const impostorListEl = $("#impostorList");
const impostorTitleEl = $("#impostorTitle");
const revealWordLineEl = $("#revealWordLine");
const revealCenterEl = $("#revealCenter");

const btnNewRound = $("#btnNewRound");
const btnNewRound2 = $("#btnNewRound2");
const btnGoSetup = $("#btnGoSetup");
const btnReset = $("#btnReset");
const btnTheme = $("#btnTheme");

// -------------------- Banco de categorías (40 x 15) --------------------
// Palabras de 1 sola palabra (sin espacios)
const CATEGORIES = [
  { name:"Aromas", words:["pan","café","vainilla","menta","limón","canela","cacao","azahar","pino","jazmín","coco","manzana","lavanda","romero","miel"] },
  { name:"Mochila", words:["cargador","libreta","botella","auriculares","bolígrafo","gafas","llaves","pañuelos","powerbank","cable","chicle","paraguas","tarjeta","cartera","gel"] },
  { name:"Nocturnos", words:["búho","murciélago","zorro","tejón","mapache","erizo","lince","coyote","chacal","polilla","grillo","rana","salamanquesa","calamar","tarántula"] },
  { name:"Calma", words:["playa","bosque","lago","mirador","biblioteca","cabaña","jardín","azotea","balcón","templo","pradera","invernadero","acantilado","cascada","hogar"] },
  { name:"Callejera", words:["taco","arepa","kebab","bao","falafel","crepe","churro","pretzel","empanada","pincho","bocata","samosa","donut","mazorca","ramen"] },
  { name:"Frágiles", words:["vaso","bombilla","cristal","galleta","huevo","tiza","flor","taza","pantalla","pluma","ramita","burbuja","concha","gominola","cáscara"] },
  { name:"Paranoias", words:["globos","ascensor","túnel","espejo","tormenta","aguja","portazo","silencio","muñeco","sombra","ruido","insecto","altura","sirena","oscuro"] },
  { name:"Ruedas", words:["bicicleta","patinete","maleta","carrito","skate","camión","tractor","moto","caravana","carretilla","patines","sillón","coche","bici","monopatín"] },
  { name:"Música", words:["guitarra","piano","batería","violín","flauta","trompeta","saxofón","ukelele","cajón","arpa","banjo","oboe","gaita","trombón","clarinete"] },
  { name:"Bebidas", words:["limonada","horchata","kombucha","granizado","batido","infusión","zumo","chocolate","agua","tónica","smoothie","mosto","cacao","té","malteada"] },

  { name:"Pegajosas", words:["miel","chicle","caramelo","mermelada","resina","jarabe","cinta","silicona","melaza","slime","sirope","almíbar","barniz","pegamento","alquitrán"] },
  { name:"Poderes", words:["telepatía","invisibilidad","levitación","teletransporte","precognición","magnetismo","camuflaje","clonación","criokinesis","pirokinesis","elasticidad","hipnosis","metamorfosis","intangibilidad","regeneración"] },
  { name:"Cola", words:["scroll","suspiro","reloj","móvil","bostezo","audio","mensaje","mirada","paciencia","queja","silencio","cambio","postura","cálculo","distraer"] },
  { name:"Baño", words:["toalla","espejo","jabón","papel","cepillo","pasta","ducha","peine","champú","colonia","báscula","secador","cortina","lavabo","desagüe"] },
  { name:"Texturas", words:["rugoso","suave","áspero","gomoso","crujiente","mullido","pegajoso","granulado","sedoso","arenoso","esponjoso","viscoso","resbaloso","mate","liso"] },
  { name:"Brillos", words:["neón","linterna","lucero","pantalla","diamante","luna","faro","purpurina","espejo","vela","farola","chispa","relámpago","aurora","led"] },
  { name:"Estrépito", words:["trueno","sirena","taladro","petardo","motor","alarma","claxon","portazo","avión","altavoz","martillo","licuadora","aspiradora","timbre","grito"] },
  { name:"Oficina", words:["grapadora","postit","clip","carpeta","rotulador","sello","teclado","ratón","agenda","regla","impresora","archivador","cuaderno","tóner","cúter"] },
  { name:"Colección", words:["sellos","monedas","cromos","imanes","vinilos","postales","chapas","cómics","llaveros","plumas","relojes","figuras","entradas","cartas","piedras"] },
  { name:"Mojado", words:["lluvia","manguera","piscina","olas","sudor","grifo","spray","charco","niebla","fuente","regadera","chorro","rocío","nieve","taza"] },

  { name:"Cocina", words:["sartén","cuchillo","tabla","colador","espátula","batidor","horno","microondas","tostadora","olla","rallador","cazo","pinzas","molinillo","jarra"] },
  { name:"Pica", words:["guindilla","pimienta","ortiga","mosquito","avispa","jengibre","mostaza","cebolla","cactus","arena","sal","papel","lana","humo","vinagre"] },
  { name:"Playa", words:["toalla","sombrilla","arena","ola","flotador","chanclas","concha","nevera","pala","cubeta","gafas","protector","silla","pelota","tabla"] },
  { name:"Montaña", words:["sendero","mochila","cima","refugio","brújula","cuerda","botas","mapa","linterna","roca","pino","cantimplora","chubasquero","bastón","carpa"] },
  { name:"Inflables", words:["globo","colchón","rueda","balón","flotador","airbag","donut","balsa","cama","neumático","pelota","pulmón","chaleco","manguito","colchoneta"] },
  { name:"Plegables", words:["papel","servilleta","mapa","paraguas","abanico","cartón","manta","silla","pajita","acordeón","libro","cinta","toalla","bolsa","camisa"] },
  { name:"Desaparecen", words:["calcetín","mando","llaves","boli","horquilla","tapón","pendrive","gafas","auricular","cargador","moneda","guante","anillo","tarjeta","tapa"] },
  { name:"Parque", words:["banco","columpio","tobogán","árbol","fuente","perro","pato","farola","papelera","césped","estatua","kiosco","sendero","bicis","pelota"] },
  { name:"Suerte", words:["trébol","herradura","amuleto","moneda","pulsera","ritual","número","talismán","cinta","campana","piedra","ojo","llavero","tótem","deseo"] },
  { name:"Sueño", words:["sofá","manta","lluvia","siesta","cama","noche","silencio","tren","lectura","luz","chimenea","masaje","cansancio","bostezo","podcast"] },

  { name:"Refresca", words:["hielo","sombra","brisa","sandía","ducha","abanico","piscina","granizado","nube","menta","limón","agua","spray","helado","ventilador"] },
  { name:"Calienta", words:["estufa","bufanda","sopa","sol","chimenea","abrigo","radiador","sauna","guantes","horno","té","manta","fuego","cacao","calor"] },
  { name:"Espacio", words:["planeta","satélite","cometa","asteroide","estrella","galaxia","nebulosa","cohete","órbita","meteorito","cráter","telescopio","constelación","cosmos","vacío"] },
  { name:"Festival", words:["pulsera","escenario","confeti","luces","carpa","merch","cola","mapa","vaso","DJ","altavoz","pantalla","seguridad","ticket","punto"] },
  { name:"Súper", words:["carrito","caja","cinta","oferta","pasillo","congelado","fruta","ticket","bolsa","escáner","estante","lácteo","pan","código","cesta"] },
  { name:"Tren", words:["andén","vagón","asiento","maleta","billete","ventana","túnel","raíl","horario","parada","revisor","marcha","locomotora","pasillo","coche"] },
  { name:"Casa", words:["puerta","sofá","nevera","mesa","cama","silla","armario","ventana","alfombra","lámpara","pasillo","cocina","baño","balcón","salón"] },
  { name:"Fiesta", words:["música","globos","tarta","velas","regalo","baile","brindis","snacks","guirnalda","sorpresa","foto","risa","copas","confeti","invitación"] },
  { name:"Vuela", words:["pájaro","avión","dron","cometa","mosca","abeja","pluma","bumerán","mariposa","globo","murciélago","polen","helicóptero","hoja","chispazo"] },
  { name:"Invierno", words:["nieve","gorra","bufanda","guantes","abrigo","vaho","charco","sopa","castaña","mantita","calefacción","noche","escarcha","taza","chimenea"] },
];

// -------------------- Estado --------------------
let players = loadPlayers(); // array de strings
let round = null; // { categoryName, secretWord, impostorIndices:Set, assignments: [] }
let turn = 0;
let holding = false;

// -------------------- Persistencia --------------------
function savePlayers() {
  localStorage.setItem(LS_PLAYERS_KEY, JSON.stringify(players));
}
function loadPlayers() {
  try {
    const raw = localStorage.getItem(LS_PLAYERS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function setTheme(theme) {
  const html = document.documentElement;
  html.setAttribute("data-theme", theme);
  localStorage.setItem(LS_THEME_KEY, theme);
}
function initTheme() {
  const saved = localStorage.getItem(LS_THEME_KEY);
  setTheme(saved === "light" ? "light" : "dark");
}

// -------------------- Helpers --------------------
function randInt(max) { return Math.floor(Math.random() * max); }

function pickUniqueIndices(n, k) {
  // k <= n
  const idxs = Array.from({ length: n }, (_, i) => i);
  // Fisher-Yates hasta k
  for (let i = n - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  return idxs.slice(0, k);
}

function showScreen(which) {
  screenSetup.classList.add("hidden");
  screenTurn.classList.add("hidden");
  screenEnd.classList.add("hidden");
  which.classList.remove("hidden");
}

function maxImpostors() {
  return Math.max(1, Math.floor(players.length / 2));
}

function getChosenImpostors() {
  const val = parseInt(impostorCountSel.value, 10);
  if (!Number.isFinite(val) || val < 1) return 1;
  return Math.min(val, maxImpostors());
}

function rebuildImpostorSelect() {
  const max = maxImpostors();

  // valor guardado
  const saved = parseInt(localStorage.getItem(LS_IMP_KEY), 10);
  const preferred = Number.isFinite(saved) ? saved : 1;

  impostorCountSel.innerHTML = "";
  for (let i = 1; i <= max; i++) {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = i === 1 ? "1 impostor" : `${i} impostores`;
    impostorCountSel.appendChild(opt);
  }

  // Seleccionar el mejor valor posible
  const finalVal = Math.min(Math.max(1, preferred), max);
  impostorCountSel.value = String(finalVal);
}

function renderPlayers() {
  playersList.innerHTML = "";
  players.forEach((name, idx) => {
    const li = document.createElement("li");

    const left = document.createElement("div");
    left.className = "pname";

    const badge = document.createElement("div");
    badge.className = "pbadge";
    badge.textContent = String(idx + 1);

    const span = document.createElement("span");
    span.textContent = name;

    left.appendChild(badge);
    left.appendChild(span);

    const del = document.createElement("button");
    del.className = "iconBtn";
    del.title = "Eliminar";
    del.innerHTML = "🗑️";
    del.addEventListener("click", () => {
      players.splice(idx, 1);
      savePlayers();
      renderPlayers();
    });

    li.appendChild(left);
    li.appendChild(del);
    playersList.appendChild(li);
  });

  playersCount.textContent = `${players.length} jugador${players.length === 1 ? "" : "es"}`;
  btnStart.disabled = players.length < 3;

  rebuildImpostorSelect();
}

function generateRound() {
  const cat = CATEGORIES[randInt(CATEGORIES.length)];
  const word = cat.words[randInt(cat.words.length)];

  const impCount = getChosenImpostors();
  localStorage.setItem(LS_IMP_KEY, String(impCount));

  const impostorIdxs = new Set(pickUniqueIndices(players.length, impCount));

  // assignments: "WORD" o "IMPOSTOR"
  const assignments = players.map((_, i) => (impostorIdxs.has(i) ? "IMPOSTOR" : "WORD"));

  return {
    categoryName: cat.name,
    secretWord: word,
    impostorIndices: impostorIdxs,
    assignments
  };
}

function startRound() {
  if (players.length < 3) return;
  round = generateRound();
  turn = 0;

  roundCategory.textContent = `Categoría: ${round.categoryName}`;
  turnTotal.textContent = String(players.length);

  showScreen(screenTurn);
  renderTurn();
  hideSecret();
}

// -------------------- Turnos --------------------
function renderTurn() {
  turnIndex.textContent = String(turn + 1);
  turnPlayer.textContent = players[turn];
  secretLabel.textContent = "PALABRA SECRETA";
}

function showSecret() {
  if (!round) return;
  if (round.assignments[turn] === "IMPOSTOR") {
    secretWord.textContent = "IMPOSTOR";
  } else {
    secretWord.textContent = round.secretWord.toUpperCase();
  }
}

function hideSecret() {
  secretWord.textContent = "••••••";
}

// -------------------- Pantalla End --------------------
function goToEnd() {
  if (!round) return;
  showScreen(screenEnd);

  // reset reveal
  revealResult.classList.add("hidden");
  revealCenterEl.classList.remove("hide");
  impostorListEl.innerHTML = "";
  impostorTitleEl.textContent = "";
  revealWordLineEl.textContent = "";
  btnReveal.disabled = false;
}

// -------------------- Eventos Setup --------------------
btnAddPlayer.addEventListener("click", () => {
  const name = playerName.value.trim();
  if (!name) return;

  if (players.includes(name)) {
    alert("Ese nombre ya existe. Pon otro (o añade un emoji 😄).");
    return;
  }

  players.push(name);
  playerName.value = "";
  savePlayers();
  renderPlayers();
  playerName.focus();
});

playerName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnAddPlayer.click();
});

btnClearPlayers.addEventListener("click", () => {
  if (!players.length) return;
  if (!confirm("¿Vaciar lista de jugadores?")) return;
  players = [];
  savePlayers();
  renderPlayers();
});

impostorCountSel.addEventListener("change", () => {
  const v = getChosenImpostors();
  localStorage.setItem(LS_IMP_KEY, String(v));
});

btnStart.addEventListener("click", () => startRound());

// -------------------- Eventos Turnos --------------------
btnBackToSetup.addEventListener("click", () => showScreen(screenSetup));

btnNext.addEventListener("click", () => {
  if (!round) return;

  holding = false;
  holdArea.classList.remove("revealed");
  hideSecret();

  turn++;
  if (turn >= players.length) goToEnd();
  else renderTurn();
});

btnFinish.addEventListener("click", () => goToEnd());

// -------------------- Reveal --------------------
btnReveal.addEventListener("click", () => {
    if (!round) return;
    btnReveal.disabled = true;
    revealCenterEl.classList.add("hide");
  
    const impostorIdxs = Array.from(round.impostorIndices).sort((a,b)=>a-b);
  
    // Título según cantidad
    impostorTitleEl.textContent = (impostorIdxs.length === 1) ? "IMPOSTOR" : "IMPOSTORES";
  
    // Palabra (solo aparece al revelar)
    revealWordLineEl.textContent = `Palabra: ${round.secretWord}`;
  
    impostorListEl.innerHTML = "";
    for (const idx of impostorIdxs) {
      const li = document.createElement("li");
      li.textContent = players[idx];
      impostorListEl.appendChild(li);
    }
  
    revealResult.classList.remove("hidden");
  });  
  
// -------------------- Nueva partida / Reset --------------------
btnNewRound.addEventListener("click", () => {
  if (players.length < 3) showScreen(screenSetup);
  else startRound();
});
btnNewRound2.addEventListener("click", () => {
  if (players.length < 3) showScreen(screenSetup);
  else startRound();
});
btnGoSetup.addEventListener("click", () => showScreen(screenSetup));

btnReset.addEventListener("click", () => {
  if (!confirm("Esto borrará jugadores guardados y reiniciará todo. ¿Seguro?")) return;
  localStorage.removeItem(LS_PLAYERS_KEY);
  players = [];
  round = null;
  turn = 0;
  renderPlayers();
  showScreen(screenSetup);
});

// -------------------- Tema --------------------
btnTheme.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

// -------------------- Hold-to-reveal (Pointer Events) --------------------
function onHoldStart(e) {
  if (!round) return;
  e.preventDefault();
  holding = true;
  holdArea.classList.add("revealed");
  showSecret();
}
function onHoldEnd(e) {
  if (!round) return;
  e.preventDefault();
  holding = false;
  holdArea.classList.remove("revealed");
  hideSecret();
}

holdArea.addEventListener("pointerdown", onHoldStart);
holdArea.addEventListener("pointerup", onHoldEnd);
holdArea.addEventListener("pointercancel", onHoldEnd);
holdArea.addEventListener("pointerleave", () => {
  if (holding) onHoldEnd(new Event("pointerleave"));
});
holdArea.addEventListener("contextmenu", (e) => e.preventDefault());

// -------------------- Init --------------------
initTheme();
renderPlayers();
showScreen(screenSetup);
