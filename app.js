/* Daily Sky app: profile, date navigation, rendering. */
(function () {
  const E = SkyEngine, L = LORE;
  const $ = s => document.querySelector(s);
  const NS = "http://www.w3.org/2000/svg";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const G = { Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂", Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇", NNode: "☊", ASC: "AC", MC: "MC", Earth: "⊕", SNode: "☋" };
  const glyph = k => (G[k] || k) + (G[k] && G[k].length === 1 ? "︎" : "");
  const NAMES = { NNode: "North Node", ASC: "Ascendant", MC: "Midheaven" };
  const nm = k => NAMES[k] || k;
  const CITIES = [["Paris", 48.8566, 2.3522, "Europe/Paris"], ["Berlin", 52.52, 13.405, "Europe/Berlin"], ["London", 51.5074, -0.1278, "Europe/London"], ["Madrid", 40.4168, -3.7038, "Europe/Madrid"], ["Rome", 41.9028, 12.4964, "Europe/Rome"], ["Amsterdam", 52.3676, 4.9041, "Europe/Amsterdam"], ["Brussels", 50.8503, 4.3517, "Europe/Brussels"], ["Zurich", 47.3769, 8.5417, "Europe/Zurich"], ["Vienna", 48.2082, 16.3738, "Europe/Vienna"], ["Lisbon", 38.7223, -9.1393, "Europe/Lisbon"], ["Lyon", 45.764, 4.8357, "Europe/Paris"], ["Marseille", 43.2965, 5.3698, "Europe/Paris"], ["Munich", 48.1351, 11.582, "Europe/Berlin"], ["Hamburg", 53.5511, 9.9937, "Europe/Berlin"], ["Stockholm", 59.3293, 18.0686, "Europe/Stockholm"], ["New York", 40.7128, -74.006, "America/New_York"], ["Los Angeles", 34.0522, -118.2437, "America/Los_Angeles"], ["Montreal", 45.5019, -73.5674, "America/Toronto"], ["Mexico City", 19.4326, -99.1332, "America/Mexico_City"], ["São Paulo", -23.5505, -46.6333, "America/Sao_Paulo"], ["Dakar", 14.7167, -17.4677, "Africa/Dakar"], ["Casablanca", 33.5731, -7.5898, "Africa/Casablanca"], ["Tokyo", 35.6762, 139.6503, "Asia/Tokyo"], ["Mumbai", 19.076, 72.8777, "Asia/Kolkata"], ["Sydney", -33.8688, 151.2093, "Australia/Sydney"]];

  // ---------- storage ----------
  const KEY = "dailysky.profile.v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const save = p => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { } };
  let profile = load(), natal = null, natalBZ = null;
  // URL #setup=... lets the profile travel in a link that never reaches a server
  try {
    const m = location.hash.match(/^#p=(.+)$/);
    if (m) { profile = JSON.parse(decodeURIComponent(atob(m[1]))); save(profile); history.replaceState(null, "", location.pathname); }
  } catch (e) { }

  function ymdIn(tz, d = new Date()) { const p = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d).split("-").map(Number); return p; }
  function hmIn(tz, d) { return new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d); }
  let sel = null;

  function computeNatal() {
    const [y, m, d] = profile.date.split("-").map(Number), [hh, mm] = profile.time.split(":").map(Number);
    const birth = E.zoned(y, m, d, hh, mm, profile.btz);
    natal = E.natalChart(birth, +profile.lat, +profile.lon);
    const ut = birth.getUTCHours() + birth.getUTCMinutes() / 60;
    const solar = ((ut + profile.lon / 15 + E.eot(birth) / 60) % 24 + 24) % 24;
    natalBZ = E.baziFull(birth, y, m, d, solar);
    natal.ymd = [y, m, d];
  }

  // ---------- day model ----------
  function dayModel(y, m, d) {
    const tz = profile.tz;
    const noon = E.zoned(y, m, d, 12, 0, tz), start = E.zoned(y, m, d, 0, 0, tz), end = new Date(start.getTime() + 86400e3);
    const tr = E.positions(noon);
    const asp = E.transitAspects(tr, natal);
    const trAct = E.activations(noon);
    const natalG = natal.gates;
    const dayG = new Set(E.gatesOf(trAct));
    for (let h = 0; h <= 24; h += 3) E.gatesOf(E.activations(new Date(start.getTime() + h * 3600e3))).forEach(g => dayG.add(g));
    const key = c => c.join("-");
    const natCh = new Set(natal.channels.map(key));
    const comb = new Set([...natalG, ...E.gatesOf(trAct)]);
    const completed = E.channelsOf(comb).filter(c => !natCh.has(key(c)) && !E.channelsOf(E.gatesOf(trAct)).some(t => key(t) === key(c)));
    const transitOnly = E.channelsOf(E.gatesOf(trAct));
    const natDef = new Set(natal.defined);
    const dayDef = E.definedCenters(E.channelsOf(comb));
    const num = E.numerology(natal.ymd[0], natal.ymd[1], natal.ymd[2], y, m, d);
    const bz = E.baziFull(noon, y, m, d);
    const god = E.tenGod(natalBZ.day.stem, bz.day.stem);
    const rel = E.branchRelation(natalBZ.day.branch, bz.day.branch);
    const moon = E.moonPhase(noon);
    const moonTl = E.moonGateTimeline(start);
    const bio = E.biorhythm(natal.ymd, [y, m, d]);
    // Moon contacts to natal points through the day
    const natPts = { ...Object.fromEntries(Object.entries(natal.positions).map(([k, v]) => [k, v.lon])), ASC: natal.houses.asc, MC: natal.houses.mc };
    const contacts = []; const ASPS = [[0, "conjunct"], [90, "square"], [120, "trine"], [180, "opposite"]];
    let prev = {};
    for (let mi = 0; mi <= 1440; mi += 10) {
      const t = new Date(start.getTime() + mi * 60e3), ml = E.lonOf("Moon", t);
      for (const [k, l] of Object.entries(natPts)) for (const [a, n] of ASPS) {
        const v = Math.abs(E.sdiff(ml, l)) - a, id = k + a;
        if (prev[id] != null && Math.sign(prev[id]) !== Math.sign(v) && Math.abs(v) < 3) contacts.push({ min: mi, txt: `Moon ${n} your ${nm(k)}`, hard: a === 90 || a === 180 });
        prev[id] = v;
      }
      for (const k of ["Saturn", "Mars", "Jupiter", "Venus", "Neptune", "Pluto", "Uranus"]) {
        const v = E.sdiff(ml, E.lonOf(k, t)), id = "t" + k;
        if (prev[id] != null && Math.sign(prev[id]) !== Math.sign(v) && Math.abs(v) < 5) contacts.push({ min: mi, txt: `Moon meets ${k}`, hard: ["Saturn", "Mars", "Pluto"].includes(k) });
        prev[id] = v;
      }
    }
    const upcoming = E.upcoming(natal, start, 12).filter(u => u.date > start);
    // ---------- signals & themes ----------
    const sig = [];
    const strong = asp.filter(a => a.t !== "Moon").slice(0, 3);
    strong.forEach(a => sig.push({ sys: "Astrology", theme: L.planets[a.t][0], hard: ["square", "opposite"].includes(a.aspect) || (a.aspect === "conjunct" && ["Saturn", "Pluto", "Mars", "Uranus", "Neptune"].includes(a.t)), txt: `${a.t} ${a.aspect} ${nm(a.n)} (${a.orb.toFixed(2)}°)`, caution: L.planets[a.t][2] }));
    const sunGate = trAct.Sun.gate;
    sig.push({ sys: "Human Design", theme: L.gateTheme[sunGate] || L.centerTheme[E.centerOf(sunGate)], txt: `Sun in gate ${sunGate}.${trAct.Sun.line} (${L.gates[sunGate]})${natalG.has(sunGate) ? ", your own gate" : ""}` });
    const fast = ["Sun", "Earth", "Moon", "Mercury", "Venus", "Mars"];
    const newCenters = [...dayDef].filter(c => !natDef.has(c));
    completed.forEach(c => {
      const by = Object.entries(trAct).filter(([k, v]) => c.includes(v.gate) && !natalG.has(v.gate)).map(([k]) => k);
      const cs = c.map(E.centerOf);
      const opened = cs.filter(x => !natDef.has(x));
      if (by.some(b => fast.includes(b))) sig.push({ sys: "Human Design", theme: opened.length ? L.centerTheme[opened[0]] : L.centerTheme[cs[0]], txt: `${by.join(" & ")} completes ${c.join("–")} ${L.channels[c.join("-")]}`, hard: opened.length > 0, caution: opened.length ? `borrowed ${L.centerMeaning[opened[0]]} (your ${opened[0] === "SolarPlexus" ? "Solar Plexus" : opened[0]} is normally open)` : null });
    });
    sig.push({ sys: "Numerology", theme: L.numTheme[num.personalDay], txt: `Personal Day ${num.personalDay} · Month ${num.personalMonth} · Year ${num.personalYear}${num.personalYearFull !== num.personalYear ? ` (${num.personalYearFull}/${num.personalYear})` : ""}` });
    sig.push({ sys: "BaZi", theme: L.godTheme[god], txt: `${bz.day.name} day: ${god} for your ${E.STEM_EL[natalBZ.day.stem]}`, hard: rel === "Clash" || rel === "Harm", caution: rel === "Clash" || rel === "Harm" ? `friction with people close to you (${rel.toLowerCase()} with your day branch)` : null });
    const score = {}; sig.forEach(s => { if (s.theme) score[s.theme] = (score[s.theme] || 0) + 1; });
    const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
    const systemsPer = t => [...new Set(sig.filter(s => s.theme === t).map(s => s.sys))];
    const cautions = sig.filter(s => s.hard && s.caution);
    return { y, m, d, noon, start, end, tr, asp, trAct, completed, transitOnly, newCenters, dayDef, num, bz, god, rel, moon, moonTl, bio, contacts, upcoming, sig, ranked, systemsPer, cautions };
  }

  // ---------- render helpers ----------
  function el(p, t, a, txt) { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; p.appendChild(e); return e; }
  const fmtDate = (y, m, d, opts) => new Intl.DateTimeFormat("en-GB", Object.assign({ timeZone: "UTC" }, opts)).format(new Date(Date.UTC(y, m - 1, d, 12)));
  const minToHM = mi => `${String(Math.floor(mi / 60) % 24).padStart(2, "0")}:${String(mi % 60).padStart(2, "0")}`;

  function render() {
    const M = dayModel(...sel);
    const T1 = M.ranked[0] ? L.themes[M.ranked[0][0]] : L.themes.Reflection, T2 = M.ranked[1] ? L.themes[M.ranked[1][0]] : null;
    const topCaution = M.cautions[0];
    const typeInfo = L.types[natal.type] || ["", ""];
    const isToday = (() => { const t = ymdIn(profile.tz); return t[0] === M.y && t[1] === M.m && t[2] === M.d; })();
    $("#dlabel").textContent = fmtDate(M.y, M.m, M.d, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    $("#datepick").value = `${M.y}-${String(M.m).padStart(2, "0")}-${String(M.d).padStart(2, "0")}`;
    const agreeN = M.ranked[0] ? M.systemsPer(M.ranked[0][0]).length : 0;
    const lean = [`<b>${T1.lean.split(":")[0]}</b>${T1.lean.includes(":") ? ":" + T1.lean.split(":").slice(1).join(":") : ""}`];
    if (T2) lean.push(T2.lean);
    lean.push(`<b>${typeInfo[0]}.</b> ${typeInfo[1]}`);
    const guard = M.cautions.slice(0, 2).map(c => `<b>${c.caution[0].toUpperCase() + c.caution.slice(1)}.</b> <span class="note">${esc(c.txt)}</span>`);
    guard.push(T1.guard);
    const hdNotes = [];
    M.completed.forEach(c => {
      const by = Object.entries(M.trAct).filter(([k, v]) => c.includes(v.gate) && !natal.gates.has(v.gate)).map(([k, v]) => `${k} ${v.gate}.${v.line}`);
      const opened = c.map(E.centerOf).filter(x => !natal.defined.includes(x));
      hdNotes.push(`<div><span class="chip brass">${c.join("–")} · ${L.channels[c.join("-")]}</span><p style="margin-top:6px">${by.join(", ")} completes this channel with your own gate. ${opened.length ? `It lights your normally open <b>${opened.map(o => o === "SolarPlexus" ? "Solar Plexus" : o).join(" and ")}</b> (${opened.map(o => L.centerMeaning[o]).join("; ")}). Enjoy it, but don't build commitments on it.` : "It links centers you already have defined: more of your own energy, a different route."}${(() => { const tt = E.hdType([...natal.channels, c]).type; return tt !== natal.type ? ` While it lasts, the wiring feels like a <b>${tt}</b>. You are still a ${natal.type}.` : ""; })()}</p></div>`);
    });
    M.transitOnly.forEach(c => hdNotes.push(`<div><span class="chip mute">${c.join("–")} · ${L.channels[c.join("-")]} · everyone</span><p style="margin-top:6px">The transits alone form this channel, so everyone feels it today. ${c.map(E.centerOf).filter(x => !natal.defined.includes(x)).length ? "It runs through centers that are open in you, so you amplify it." : ""}</p></div>`));
    if (!hdNotes.length) hdNotes.push(`<p>No new channels for you today. A day to live your own design without much extra wiring.</p>`);
    const hex = M.trAct.Sun.gate;
    const tri = L.hexTri[hex - 1];
    const pyLabel = M.num.personalYearFull !== M.num.personalYear ? `${M.num.personalYearFull}/${M.num.personalYear}` : M.num.personalYear;

    const app = $("#app");
    app.innerHTML = `
<header class="hero">
  <svg class="mandala" viewBox="0 0 480 480" aria-hidden="true"><g id="mand"></g></svg>
  <div>
    <div class="eyebrow">✦ The sky of the day · for ${esc(profile.name)} ✦</div>
    <h1 style="margin-top:10px">${esc(T1.label)}${T2 ? ` and ${esc(T2.label.toLowerCase())}` : ""}. <em>${topCaution ? `Lean in, but watch for ${esc(topCaution.caution.split(" (")[0])}.` : esc(T1.lean)}</em></h1>
    <p class="lede">${agreeN >= 2 ? `${agreeN} separate systems point at <b>${esc(T1.label.toLowerCase())}</b> today.` : `The systems scatter today; no single theme dominates.`} ${M.cautions.length ? `${M.cautions.length} signal${M.cautions.length > 1 ? "s" : ""} call${M.cautions.length > 1 ? "" : "s"} for care.` : "Few hard edges in the sky."} ${isToday ? "" : `<br><span class="note">You're looking at ${fmtDate(M.y, M.m, M.d, { day: "numeric", month: "long", year: "numeric" })}.</span>`}</p>
  </div>
</header>
${profile.link && isToday ? `<a class="cta" href="${esc(profile.link)}" target="_blank" rel="noopener">✦ Read today's written reading</a>` : ""}
<section class="grid2">
  <div class="panel"><div class="head"><h2>Lean into</h2><span class="eyebrow">today</span></div><ul class="list lean">${lean.map(x => `<li><span>${x}</span></li>`).join("")}</ul></div>
  <div class="panel"><div class="head"><h2>Guard against</h2><span class="eyebrow">today</span></div><ul class="list guard">${guard.map(x => `<li><span>${x}</span></li>`).join("")}</ul></div>
</section>
<div class="orn">as above</div>
<section class="panel">
  <div class="head"><h2>The Moon's path</h2><span class="eyebrow">${esc(profile.tz.split("/").pop().replace("_", " "))} time</span></div>
  <div class="scroll"><div class="tl" id="tl" style="min-width:540px"></div></div>
  <ul class="rows">${M.moonTl.map((s, i) => { const e = M.moonTl[i + 1] ? M.moonTl[i + 1].min : 1440; return `<li><span class="t">${minToHM(s.min)}–${minToHM(e)}</span><span>Moon in gate ${s.gate}, ${esc(L.gates[s.gate])}${natal.gates.has(s.gate) ? " <b>(your gate)</b>" : ""}${(() => { const ch = E.CHANNELS.find(c => c.includes(s.gate) && natal.gates.has(c[0] === s.gate ? c[1] : c[0])); return ch ? `. Completes ${ch.join("–")} ${L.channels[ch.join("-")]}.` : "."; })()}</span></li>`; }).join("")}
  ${M.contacts.map(c => `<li><span class="t">~${minToHM(c.min)}</span><span>${c.hard ? "<b>" : ""}${esc(c.txt)}${c.hard ? "</b>" : ""}</span></li>`).join("")}</ul>
</section>
<section class="panel">
  <div class="head"><h2>Where the oracles agree</h2><span class="eyebrow">${M.sig.length} signals</span></div>
  <div class="scroll"><table class="matrix"><thead><tr><th>System</th><th>Signal</th><th>Theme</th></tr></thead><tbody>
  ${M.sig.map(s => `<tr><td>${s.sys}</td><td>${esc(s.txt)}</td><td><span class="chip ${s.hard ? "warn" : s.theme === M.ranked[0]?.[0] ? "ok" : "mute"}">${esc(L.themes[s.theme]?.label || "—")}</span></td></tr>`).join("")}
  </tbody></table></div>
  <div class="bars">${M.ranked.map(([t, n]) => `<div class="r"><span>${L.themes[t].label}</span><div class="track"><i style="width:${n / M.sig.length * 100}%"></i></div><span class="note">${n}</span></div>`).join("")}</div>
  <div class="verdict">
    <div class="box agree"><h3>Agreement</h3><p>${agreeN >= 2 ? `${M.systemsPer(M.ranked[0][0]).join(", ")} all land on ${esc(T1.label.toLowerCase())}. Treat it as the theme of the day.` : "No two systems agree strongly. Treat today as open."}</p></div>
    <div class="box clash"><h3>Tension</h3><p>${(() => { const act = ["Action", "Change", "Resources"].includes(M.ranked[0]?.[0]); if (act && ["Generator", "Projector", "Reflector"].includes(natal.type)) return `The sky pushes toward ${esc(T1.label.toLowerCase())}, while your ${natal.type} strategy says <b>${typeInfo[0].toLowerCase()}</b>. Don't start new things; respond fully to what comes.`; if (M.cautions.length) return `${esc(M.cautions[0].txt)} pulls against the main theme. Go ahead, at a pace your body agrees with.`; return "Little conflict between the systems today."; })()}</p></div>
  </div>
</section>
<section class="grid2">
  <div class="panel"><div class="head"><h2>Your sky</h2><span class="eyebrow">inner: birth · outer: this day</span></div>
    <svg id="wheel" class="svgbox" viewBox="0 0 440 440" style="max-width:440px" role="img" aria-label="Chart wheel"></svg>
    <div class="legend"><span><i style="border-color:var(--warn)"></i>square / opposition</span><span><i style="border-color:var(--ok)"></i>trine / sextile</span><span><i style="border-color:var(--brass)"></i>conjunction</span></div></div>
  <div class="panel"><div class="head"><h2>Living aspects</h2><span class="eyebrow">longer = stronger</span></div>
    <div class="asp" style="display:flex;flex-direction:column;gap:12px">${M.asp.filter(a => a.t !== "Moon").slice(0, 8).map(a => { const hard = ["square", "opposite"].includes(a.aspect); const c = hard ? "var(--warn)" : a.aspect === "conjunct" ? "var(--brass)" : "var(--ok)"; const w = Math.max(6, 100 * (1 - a.orb / 2)); return `<div class="row"><div class="lbl">${glyph(a.t)} ${a.t} ${a.aspect} your ${nm(a.n)}<small>${L.planets[a.t][1]}${hard ? `; watch ${L.planets[a.t][2]}` : ""} · ${a.applying ? "building" : "fading"}</small></div><div><div class="orb"><i style="width:${w}%;background:${c}"></i></div><span>${a.orb.toFixed(2)}° orb</span></div></div>`; }).join("") || "<p class='note'>No tight aspects today.</p>"}</div>
  </div>
</section>
<div class="orn">so below</div>
<section class="grid2">
  <div class="panel"><div class="head"><h2>Your body's map</h2><span class="eyebrow">${natal.type} · ${natal.authority} · ${natal.profile}</span></div>
    <svg id="bg" class="svgbox" viewBox="0 0 320 470" style="max-width:320px" role="img" aria-label="Bodygraph"></svg>
    <div class="legend"><span><i style="border-color:var(--ink)"></i>yours</span><span><i style="border-color:var(--brass);border-top-style:dashed"></i>completed today</span><span><i style="border-color:var(--muted);border-top-style:dotted"></i>everyone</span></div></div>
  <div class="panel"><div class="head"><h2>How the currents move you</h2></div><div style="display:flex;flex-direction:column;gap:14px">${hdNotes.join("")}</div></div>
</section>
<section class="grid3">
  <div class="panel"><div class="head"><h2>The numbers</h2></div>
    <div class="nums"><div class="num key"><span class="v">${M.num.personalDay}</span><span class="k">Personal day</span></div><div class="num"><span class="v">${M.num.personalMonth}</span><span class="k">Personal month</span></div><div class="num"><span class="v">${pyLabel}</span><span class="k">Personal year</span></div><div class="num"><span class="v">${M.num.lifePath}</span><span class="k">Life path</span></div></div>
    <p>${L.numerology[M.num.personalDay]}</p><p class="note">Tarot for day ${M.num.personalDay}: ${L.tarot[M.num.personalDay]}. Universal day ${M.num.universalDay}.</p></div>
  <div class="panel"><div class="head"><h2>Four Pillars</h2><span class="eyebrow">Day Master · ${natalBZ.day.desc.split(" ").slice(0, 2).join(" ")}</span></div>
    <div class="pillars">${["hour", "day", "month", "year"].map(k => natalBZ[k] ? `<div class="pill"><span class="k">${k}</span><span class="han">${natalBZ[k].zh}</span><small>${natalBZ[k].name}</small></div>` : "").join("")}
    <div class="pill today"><span class="k">This day</span><span class="han">${M.bz.day.zh}</span><small>${M.bz.day.name} · ${M.bz.day.desc}</small></div></div>
    <p><b>${M.god}.</b> ${L.tenGods[M.god]}${M.rel && M.rel !== "Same branch" ? ` Day branch: <b>${M.rel.toLowerCase()}</b> with yours.` : ""}</p>
    <p class="note">Month ${M.bz.month.name}, year ${M.bz.year.name} (${M.bz.year.desc}).</p></div>
  <div class="panel"><div class="head"><h2>Hexagram ${hex}</h2><span class="eyebrow">Sun gate · line ${M.trAct.Sun.line}</span></div>
    <div class="hexa"><svg id="hex" width="84" height="96" viewBox="0 0 84 96"></svg><div><h3>${L.hexNames[hex]}</h3><p class="note">${L.trigramNames[tri[0]]} over ${L.trigramNames[tri[1]]}</p></div></div>
    <p>Earth hexagram: <b>${M.trAct.Earth.gate}, ${L.hexNames[M.trAct.Earth.gate]}</b>.</p>
    <p class="note">This is the Sun's gate, shared by everyone for about six days.</p></div>
</section>
<section class="grid2">
  <div class="panel"><div class="head"><h2>Moon &amp; body</h2></div>
    <div style="display:flex;gap:18px;align-items:center"><svg id="moon" width="86" height="86" viewBox="0 0 100 100"></svg><div><h3>${M.moon.name} · ${Math.round(M.moon.illum * 100)}%</h3><p class="note">Moon in ${E.SIGNS[Math.floor(E.norm(M.tr.Moon.lon) / 30)]}, your house ${E.houseOf(M.tr.Moon.lon, natal.houses.cusps)}. Next full Moon ${new Intl.DateTimeFormat("en-GB", { timeZone: profile.tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(M.moon.nextFull)} at ${E.fmtLon(M.moon.fullLon)}.</p></div></div>
    <div class="bars">${[["Physical", M.bio.physical], ["Emotional", M.bio.emotional], ["Intellectual", M.bio.intellectual]].map(([n, v]) => `<div class="r"><span>${n}</span><div class="track c"><i style="left:${v < 0 ? 50 + v * 50 : 50}%;width:${Math.abs(v) * 50}%"></i></div><span class="note">${v > 0 ? "+" : ""}${Math.round(v * 100)}</span></div>`).join("")}</div>
    <p class="note">Biorhythm has been tested and found to predict nothing. It's here for completeness.</p></div>
  <div class="panel"><div class="head"><h2>On the horizon</h2><span class="eyebrow">next 12 days</span></div>
    <ul class="rows">${M.upcoming.slice(0, 9).map(u => `<li><span class="t">${new Intl.DateTimeFormat("en-GB", { timeZone: profile.tz, weekday: "short", day: "numeric", month: "short" }).format(u.date)}</span><span>${glyph(u.t)} ${u.t} ${u.aspect} your ${nm(u.n)}. <span class="note">${L.planets[u.t][1]}${["square", "opposite"].includes(u.aspect) ? `; watch ${L.planets[u.t][2]}` : ""}.</span></span></li>`).join("") || "<li><span></span><span class='note'>Quiet stretch.</span></li>"}</ul></div>
</section>
<div class="orn">✦</div>
<footer>
  <p><b>Calculated</b> on this phone with Astronomy Engine (positions within about 0.01° of the Swiss Ephemeris). Planet positions, gates, aspects, numbers and pillars are exact arithmetic.</p>
  <p><b>Interpreted:</b> none of these systems has shown predictive power in controlled tests. Use them as a structured prompt for attention.</p>
</footer>`;
    drawWheel(M); drawBodygraph(M); drawHex(tri); drawMoon(M.moon); drawTimeline(M, isToday); drawMandala();
  }

  function drawWheel(M) {
    const s = $("#wheel"), cx = 220, cy = 220, asc = natal.houses.asc;
    const pt = (lon, r) => { const t = (180 + (lon - asc)) * Math.PI / 180; return [cx + r * Math.cos(t), cy - r * Math.sin(t)]; };
    const R = { o: 210, z: 182, t: 156, n: 112, i: 84 };
    el(s, "circle", { cx, cy, r: R.o, fill: "none", stroke: "var(--line)" }); el(s, "circle", { cx, cy, r: R.z, fill: "none", stroke: "var(--line)" });
    el(s, "circle", { cx, cy, r: R.i, fill: "rgba(11,9,32,.6)", stroke: "var(--line)" });
    const signs = "♈♉♊♋♌♍♎♏♐♑♒♓";
    for (let i = 0; i < 12; i++) { const [x1, y1] = pt(i * 30, R.z), [x2, y2] = pt(i * 30, R.o); el(s, "line", { x1, y1, x2, y2, stroke: "var(--line)" }); const [tx, ty] = pt(i * 30 + 15, (R.z + R.o) / 2); el(s, "text", { x: tx, y: ty, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 15, fill: "var(--muted)" }, signs[i] + "︎"); }
    natal.houses.cusps.forEach((c, i) => { const [x1, y1] = pt(c, R.i), [x2, y2] = pt(c, R.z); const ang = i === 0 || i === 9; el(s, "line", { x1, y1, x2, y2, stroke: ang ? "var(--ink)" : "var(--line)", "stroke-width": ang ? 1.4 : 1 }); const n = natal.houses.cusps[(i + 1) % 12]; const mid = c + E.norm(n - c) / 2; const [hx, hy] = pt(mid, R.i - 12); el(s, "text", { x: hx, y: hy, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 9, fill: "var(--muted)" }, i + 1); });
    const place = obj => { const arr = Object.entries(obj).map(([k, v]) => ({ k, v, d: v })).sort((a, b) => a.v - b.v); for (let it = 0; it < 30; it++) for (let i = 0; i < arr.length; i++) { const a = arr[i], b = arr[(i + 1) % arr.length]; const diff = E.norm(b.d - a.d); if (diff < 9) { a.d -= (9 - diff) / 2; b.d += (9 - diff) / 2; } } return arr; };
    const natPts = { ...Object.fromEntries(Object.entries(natal.positions).map(([k, v]) => [k, v.lon])), ASC: natal.houses.asc, MC: natal.houses.mc };
    M.asp.filter(a => a.t !== "Moon").slice(0, 8).forEach(a => { const [x1, y1] = pt(M.tr[a.t].lon, R.i), [x2, y2] = pt(natPts[a.n], R.i); const c = ["square", "opposite"].includes(a.aspect) ? "var(--warn)" : a.aspect === "conjunct" ? "var(--brass)" : "var(--ok)"; el(s, "line", { x1, y1, x2, y2, stroke: c, "stroke-width": 1.3, opacity: .85 }); });
    place(natPts).forEach(p => { const [x, y] = pt(p.d, R.n); el(s, "text", { x, y, "text-anchor": "middle", "dominant-baseline": "central", "font-size": G[p.k].length > 1 ? 10 : 15, fill: "var(--ink)" }, glyph(p.k)); });
    place(Object.fromEntries(Object.entries(M.tr).map(([k, v]) => [k, v.lon]))).forEach(p => { const [x, y] = pt(p.d, R.t); const [mx, my] = pt(p.v, R.z), [m2x, m2y] = pt(p.v, R.z - 8); el(s, "line", { x1: mx, y1: my, x2: m2x, y2: m2y, stroke: "var(--brass)", "stroke-width": 2 }); el(s, "text", { x, y, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 15, fill: "var(--brass)" }, glyph(p.k)); });
  }

  function drawBodygraph(M) {
    const s = $("#bg");
    const C = { Head: [160, 40, "tu"], Ajna: [160, 110, "td"], Throat: [160, 190, "sq"], G: [160, 270, "di"], Heart: [242, 288, "ts"], Sacral: [160, 375, "sq"], Spleen: [52, 345, "tr"], SolarPlexus: [268, 345, "tl"], Root: [160, 445, "sq"] };
    const lines = [...natal.channels.map(c => [c, "n"]), ...M.completed.map(c => [c, "t"]), ...M.transitOnly.map(c => [c, "c"])];
    const pairCount = {};
    lines.forEach(([c, k]) => {
      const a = E.centerOf(c[0]), b = E.centerOf(c[1]); const pk = [a, b].sort().join(); const idx = pairCount[pk] = (pairCount[pk] || 0) + 1;
      const off = (idx - 1) * 9 * (idx % 2 ? 1 : -1);
      const [x1, y1] = C[a], [x2, y2] = C[b]; const dx = x2 - x1, dy = y2 - y1, Ln = Math.hypot(dx, dy), ox = -dy / Ln * off, oy = dx / Ln * off;
      const st = k === "n" ? { stroke: "var(--ink)", "stroke-width": 3 } : k === "t" ? { stroke: "var(--brass)", "stroke-width": 3, "stroke-dasharray": "7 5" } : { stroke: "var(--muted)", "stroke-width": 2.5, "stroke-dasharray": "2 4" };
      el(s, "line", Object.assign({ x1: x1 + ox, y1: y1 + oy, x2: x2 + ox, y2: y2 + oy, "stroke-linecap": "round" }, st));
      const fr = (pk === "Sacral,Throat" || pk === "G,Root" || pk === "Head,Throat") ? 0.25 : 0.5;
      el(s, "text", { x: x1 + dx * fr + ox * 3.4 + (off === 0 ? -16 : 0), y: y1 + dy * fr + oy * 3.4, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 9, fill: k === "n" ? "var(--ink)" : k === "t" ? "var(--brass)" : "var(--muted)", stroke: "var(--panel)", "stroke-width": 3, "paint-order": "stroke" }, c.join("–"));
    });
    for (const [n, [x, y, sh]] of Object.entries(C)) {
      const nat = natal.defined.includes(n), tmp = !nat && M.dayDef.has(n);
      const a = { fill: nat ? "var(--ink)" : tmp ? "var(--brass-soft)" : "var(--panel)", stroke: tmp ? "var(--brass)" : "var(--ink)", "stroke-width": 1.5 }; const r = 26; let p;
      if (sh === "sq") p = `M${x - r} ${y - r}h${2 * r}v${2 * r}h${-2 * r}z`; else if (sh === "tu") p = `M${x} ${y - r}L${x + r} ${y + r * .8}L${x - r} ${y + r * .8}z`; else if (sh === "td") p = `M${x - r} ${y - r * .8}L${x + r} ${y - r * .8}L${x} ${y + r}z`; else if (sh === "di") p = `M${x} ${y - r - 4}L${x + r + 4} ${y}L${x} ${y + r + 4}L${x - r - 4} ${y}z`; else if (sh === "ts") { const q = 24; p = `M${x - q} ${y + q * .8}L${x + q} ${y + q * .8}L${x} ${y - q}z`; } else if (sh === "tr") p = `M${x - r * .8} ${y - r}L${x + r} ${y}L${x - r * .8} ${y + r}z`; else p = `M${x + r * .8} ${y - r}L${x - r} ${y}L${x + r * .8} ${y + r}z`;
      a.d = p; el(s, "path", a);
      el(s, "text", { x, y: y + (sh === "tu" ? 8 : sh === "td" ? -6 : sh === "ts" ? 6 : 2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": n === "Heart" ? 7 : 8, fill: nat ? "var(--panel)" : "var(--ink)" }, n === "SolarPlexus" ? "SOLAR P." : n.toUpperCase());
    }
  }
  function drawHex(tri) { const s = $("#hex"); const lines = [...L.trigrams[tri[1]], ...L.trigrams[tri[0]]]; lines.forEach((v, i) => { const y = 86 - i * 15; if (v) el(s, "rect", { x: 4, y, width: 76, height: 8, rx: 1.5, fill: "var(--ink)" }); else { el(s, "rect", { x: 4, y, width: 33, height: 8, rx: 1.5, fill: "var(--ink)" }); el(s, "rect", { x: 47, y, width: 33, height: 8, rx: 1.5, fill: "var(--ink)" }); } }); }
  function drawMoon(m) {
    const s = $("#moon"), k = m.illum, waxing = m.elong < 180; el(s, "circle", { cx: 50, cy: 50, r: 44, fill: "rgba(255,255,255,.08)" });
    const rx = Math.abs(1 - 2 * k) * 44; const right = waxing; const outer = right ? 1 : 0; const inner = (k > .5) === right ? 1 : 0;
    el(s, "path", { d: `M50 6 A44 44 0 0 ${outer} 50 94 A${rx} 44 0 0 ${inner} 50 6z`, fill: "var(--brass)" });
  }
  function drawTimeline(M, isToday) {
    const t = $("#tl"); const pal = ["rgba(185,168,255,.25)", "rgba(226,189,106,.55)", "rgba(143,220,196,.35)", "rgba(240,154,134,.35)"];
    const bar = document.createElement("div"); bar.className = "bar";
    M.moonTl.forEach((s, i) => { const e = M.moonTl[i + 1] ? M.moonTl[i + 1].min : 1440; const d = document.createElement("div"); d.className = "seg"; d.style.left = s.min / 14.4 + "%"; d.style.width = (e - s.min) / 14.4 + "%"; d.style.background = natal.gates.has(s.gate) || E.CHANNELS.some(c => c.includes(s.gate) && natal.gates.has(c[0] === s.gate ? c[1] : c[0])) ? pal[1] : pal[i % 2 ? 2 : 0]; bar.appendChild(d); });
    t.appendChild(bar);
    [0, 6, 12, 18, 24].forEach(h => { const k = document.createElement("div"); k.className = "tick"; k.style.left = h / 24 * 100 + "%"; k.textContent = String(h).padStart(2, "0") + ":00"; if (h === 0) k.style.transform = "none"; if (h === 24) k.style.transform = "translateX(-100%)"; t.appendChild(k); });
    const evs = [...M.moonTl.slice(1).map(s => [s.min, `Moon → ${s.gate}`]), ...M.contacts.filter(c => c.hard).map(c => [c.min, c.txt.replace("Moon ", "☽ ")])];
    let lastPct = -99;
    evs.sort((a, b) => a[0] - b[0]).forEach(([mi, l]) => { const pct = mi / 14.4; if (pct - lastPct < 14) return; lastPct = pct; const e = document.createElement("div"); e.className = "ev"; e.style.left = Math.min(92, Math.max(8, pct)) + "%"; e.textContent = l; t.appendChild(e); });
    if (isToday) { const n = new Date(); const mins = (n - M.start) / 60e3; if (mins >= 0 && mins <= 1440) { const d = document.createElement("div"); d.className = "now"; d.style.left = mins / 14.4 + "%"; t.appendChild(d); } }
  }
  function drawMandala() {
    const g = $("#mand"), c = 240;
    [230, 196, 156, 110, 55].forEach((r, i) => el(g, "circle", { cx: c, cy: c, r, fill: "none", stroke: "var(--brass)", "stroke-width": i === 0 ? 1.2 : .6, opacity: .8 }));
    const sg = "♈♉♊♋♌♍♎♏♐♑♒♓";
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; el(g, "line", { x1: c + 196 * Math.cos(a), y1: c + 196 * Math.sin(a), x2: c + 230 * Math.cos(a), y2: c + 230 * Math.sin(a), stroke: "var(--brass)", "stroke-width": .6 }); const b = a + Math.PI / 12; el(g, "text", { x: c + 213 * Math.cos(b), y: c + 213 * Math.sin(b), "text-anchor": "middle", "dominant-baseline": "central", "font-size": 15, fill: "var(--brass)" }, sg[i] + "︎"); }
    for (let k = 0; k < 2; k++) { const pts = []; for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 3 + k * Math.PI; pts.push((c + 156 * Math.cos(a)) + "," + (c + 156 * Math.sin(a))); } el(g, "polygon", { points: pts.join(" "), fill: "none", stroke: "var(--brass)", "stroke-width": .7 }); }
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; el(g, "circle", { cx: c + 55 * Math.cos(a), cy: c + 55 * Math.sin(a), r: 55, fill: "none", stroke: "var(--sky)", "stroke-width": .6 }); }
    for (let i = 0; i < 64; i++) { const a = i * Math.PI / 32; el(g, "line", { x1: c + 110 * Math.cos(a), y1: c + 110 * Math.sin(a), x2: c + (i % 8 ? 116 : 122) * Math.cos(a), y2: c + (i % 8 ? 116 : 122) * Math.sin(a), stroke: "var(--brass)", "stroke-width": .6 }); }
  }
  // ---------- stars ----------
  let starRaf = null;
  function stars() {
    const c = $("#stars"); const d = Math.min(2, devicePixelRatio || 1), w = innerWidth, h = innerHeight; c.width = w * d; c.height = h * d; const x = c.getContext("2d"); x.setTransform(d, 0, 0, d, 0, 0);
    let seed = 20261120; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const S = []; for (let i = 0; i < Math.round(w * h / 2600); i++) S.push([r() * w, r() * h, r() * 1.3 + .2, r() * 6.28, r()]);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    cancelAnimationFrame(starRaf);
    const draw = t => { x.clearRect(0, 0, w, h); for (const [sx, sy, sr, ph, warm] of S) { const a = .35 + .45 * (still ? 1 : .5 + .5 * Math.sin(t / 1400 + ph)); x.fillStyle = warm > .85 ? `rgba(255,220,160,${a})` : `rgba(220,215,255,${a})`; x.beginPath(); x.arc(sx, sy, sr, 0, 6.283); x.fill(); } if (!still) starRaf = requestAnimationFrame(draw); };
    draw(0);
  }
  // ---------- setup ----------
  function openSetup(first) {
    const dlg = $("#setup"); const sel = $("#f-city");
    sel.innerHTML = `<option value="">Choose a city, or type coordinates below</option>` + CITIES.map((c, i) => `<option value="${i}">${c[0]}</option>`).join("");
    sel.onchange = () => { const c = CITIES[sel.value]; if (c) { $("#f-lat").value = c[1]; $("#f-lon").value = c[2]; $("#f-btz").value = c[3]; } };
    const p = profile || {};
    $("#f-name").value = p.name || ""; $("#f-date").value = p.date || ""; $("#f-time").value = p.time || ""; $("#f-lat").value = p.lat ?? ""; $("#f-lon").value = p.lon ?? ""; $("#f-btz").value = p.btz || ""; $("#f-tz").value = p.tz || Intl.DateTimeFormat().resolvedOptions().timeZone; $("#f-link").value = p.link || "";
    $("#cancelSetup").hidden = !!first;
    dlg.showModal();
  }
  $("#setupForm").addEventListener("submit", e => {
    e.preventDefault();
    const p = { name: $("#f-name").value.trim(), date: $("#f-date").value, time: $("#f-time").value, lat: +$("#f-lat").value, lon: +$("#f-lon").value, btz: $("#f-btz").value.trim(), tz: $("#f-tz").value.trim(), link: $("#f-link").value.trim() };
    try { new Intl.DateTimeFormat("en", { timeZone: p.btz }); new Intl.DateTimeFormat("en", { timeZone: p.tz }); } catch (err) { alert("Time zone not recognised. Use a name like Europe/Paris."); return; }
    profile = p; save(p); $("#setup").close(); start();
  });
  $("#cancelSetup").onclick = () => $("#setup").close();
  $("#settingsBtn").onclick = () => openSetup(false);
  const shift = n => { const t = new Date(Date.UTC(sel[0], sel[1] - 1, sel[2] + n)); sel = [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()]; render(); scrollTo({ top: 0 }); };
  $("#prev").onclick = () => shift(-1); $("#next").onclick = () => shift(1);
  $("#today").onclick = () => { sel = ymdIn(profile.tz); render(); };
  $("#datepick").onchange = e => { if (e.target.value) { sel = e.target.value.split("-").map(Number); render(); } };
  document.addEventListener("visibilitychange", () => { if (!document.hidden && profile) { const t = ymdIn(profile.tz); if (sel && t.join() !== sel.join() && lastAuto.join() !== t.join()) { sel = t; lastAuto = t; render(); } } });
  let lastAuto = [];
  function start() {
    if (!profile) { $("#app").innerHTML = `<div class="welcome"><h1>Daily Sky</h1><p class="note">Astrology, Human Design, numerology, BaZi and the I Ching, calculated on your phone for any day.</p><button class="gold" id="begin">Enter your birth data</button></div>`; $("#begin").onclick = () => openSetup(true); return; }
    computeNatal(); sel = ymdIn(profile.tz); lastAuto = sel; render();
  }
  addEventListener("resize", () => { clearTimeout(window.__rs); window.__rs = setTimeout(stars, 200); });
  stars(); start();
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => { });
})();
