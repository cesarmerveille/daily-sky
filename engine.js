/* Daily Sky engine: pure calculations, no interpretation. Works in the browser (global SkyEngine) and in Node. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("astronomy-engine"));
  else root.SkyEngine = factory(root.Astronomy);
})(typeof self !== "undefined" ? self : this, function (A) {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const norm = x => ((x % 360) + 360) % 360;
  const sdiff = (a, b) => ((a - b + 540) % 360) - 180; // signed a-b in (-180,180]
  const BODIES = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
  const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  function lonOf(body, date) {
    const t = A.MakeTime(date);
    if (body === "Moon") return A.EclipticGeoMoon(t).lon;
    if (body === "Sun") return A.SunPosition(t).elon;
    if (body === "NNode") return trueNode(t);
    const v = A.GeoVector(body, t, true);
    return norm(A.SphereFromVector(A.RotateVector(A.Rotation_EQJ_ECT(t), v)).lon);
  }
  // True lunar node, Meeus ch.47 (accurate to ~0.1 deg)
  function trueNode(t) {
    const T = t.tt / 36525;
    const D = norm(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
    const M = norm(357.5291092 + 35999.0502909 * T);
    const Mp = norm(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
    const F = norm(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);
    const Om = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T;
    const s = x => Math.sin(x * D2R);
    return norm(Om - 1.4979 * s(2 * (D - F)) - 0.15 * s(M) - 0.1226 * s(2 * D) + 0.1176 * s(2 * F) - 0.0801 * s(2 * (Mp - F)));
  }
  function positions(date) {
    const o = {};
    for (const b of [...BODIES, "NNode"]) {
      const l = lonOf(b, date);
      const l2 = lonOf(b, new Date(date.getTime() + 3600e3));
      o[b] = { lon: l, speed: sdiff(l2, l) * 24 };
    }
    return o;
  }
  // Houses: Placidus with fallback to Porphyry above polar circle
  function houses(date, lat, lon) {
    const t = A.MakeTime(date);
    const ramc = norm(A.SiderealTime(t) * 15 + lon);
    const eps = A.e_tilt(t).tobl * D2R;
    const phi = lat * D2R;
    const mc = norm(Math.atan2(Math.sin(ramc * D2R), Math.cos(ramc * D2R) * Math.cos(eps)) * R2D);
    let asc = norm(Math.atan2(Math.cos(ramc * D2R), -(Math.sin(ramc * D2R) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) * R2D);
    if (Math.abs(sdiff(asc, mc)) > 0 && sdiff(asc, mc) < 0) asc = norm(asc + 180);
    const lonFromRA = ra => norm(Math.atan2(Math.sin(ra * D2R), Math.cos(ra * D2R) * Math.cos(eps)) * R2D);
    const decOf = l => Math.asin(Math.sin(eps) * Math.sin(l * D2R));
    function plac(offset, frac, above) {
      let l = lonFromRA(ramc + offset);
      for (let i = 0; i < 40; i++) {
        const x = Math.tan(decOf(l)) * Math.tan(phi);
        if (Math.abs(x) >= 1) return null;
        const sa = Math.acos(-x) * R2D; // diurnal semi-arc
        const ra = above ? ramc + frac * sa : ramc + 180 - frac * (180 - sa);
        const nl = lonFromRA(ra);
        if (Math.abs(sdiff(nl, l)) < 1e-6) { l = nl; break; }
        l = nl;
      }
      return l;
    }
    let c11 = plac(30, 1 / 3, true), c12 = plac(60, 2 / 3, true), c2 = plac(120, 2 / 3, false), c3 = plac(150, 1 / 3, false);
    if ([c11, c12, c2, c3].some(v => v == null)) { // Porphyry
      const q1 = norm(asc - mc), q2 = norm(mc + 180 - asc);
      c11 = norm(mc + q1 / 3); c12 = norm(mc + 2 * q1 / 3); c2 = norm(asc + q2 / 3); c3 = norm(asc + 2 * q2 / 3);
    }
    const ic = norm(mc + 180), dsc = norm(asc + 180);
    const cusps = [asc, c2, c3, ic, norm(c11 + 180), norm(c12 + 180), dsc, norm(c2 + 180), norm(c3 + 180), mc, c11, c12];
    return { cusps, asc, mc };
  }
  function houseOf(l, cusps) {
    for (let i = 0; i < 12; i++) { const a = cusps[i], b = cusps[(i + 1) % 12]; if (norm(l - a) < norm(b - a)) return i + 1; }
    return 1;
  }
  // ---------- Human Design ----------
  const WHEEL = [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60];
  function gateOf(l) { const x = norm(l - 302) / 5.625, i = Math.floor(x); return { gate: WHEEL[i], line: Math.floor((x - i) * 6) + 1 }; }
  const CHANNELS = [[1, 8], [2, 14], [3, 60], [4, 63], [5, 15], [6, 59], [7, 31], [9, 52], [10, 20], [10, 34], [10, 57], [11, 56], [12, 22], [13, 33], [16, 48], [17, 62], [18, 58], [19, 49], [20, 34], [20, 57], [21, 45], [23, 43], [24, 61], [25, 51], [26, 44], [27, 50], [28, 38], [29, 46], [30, 41], [32, 54], [34, 57], [35, 36], [37, 40], [39, 55], [42, 53], [47, 64]];
  const CENTERS = { Head: [64, 61, 63], Ajna: [47, 24, 4, 17, 43, 11], Throat: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16], G: [7, 1, 13, 25, 46, 2, 15, 10], Heart: [21, 40, 26, 51], Sacral: [34, 5, 14, 29, 59, 9, 3, 42, 27], SolarPlexus: [36, 22, 37, 6, 49, 55, 30], Spleen: [48, 57, 44, 50, 32, 28, 18], Root: [58, 38, 54, 53, 60, 52, 19, 39, 41] };
  const centerOf = g => Object.keys(CENTERS).find(c => CENTERS[c].includes(g));
  function activations(date) {
    const p = positions(date), o = {};
    for (const [k, v] of Object.entries(p)) {
      o[k] = gateOf(v.lon);
      if (k === "Sun") o.Earth = gateOf(v.lon + 180);
      if (k === "NNode") o.SNode = gateOf(v.lon + 180);
    }
    return o;
  }
  const gatesOf = acts => new Set(Object.values(acts).map(a => a.gate));
  const channelsOf = G => CHANNELS.filter(([a, b]) => G.has(a) && G.has(b));
  function definedCenters(chs) { const s = new Set(); chs.forEach(([a, b]) => { s.add(centerOf(a)); s.add(centerOf(b)); }); return s; }
  function designDate(birth) {
    const target = norm(lonOf("Sun", birth) - 88);
    let d = new Date(birth.getTime() - 88 * 86400e3);
    for (let i = 0; i < 30; i++) {
      const diff = sdiff(lonOf("Sun", d), target);
      if (Math.abs(diff) < 1e-7) break;
      d = new Date(d.getTime() - diff / 0.9856 * 86400e3);
    }
    return d;
  }
  function hdType(chs) {
    const dc = definedCenters(chs);
    const adj = {}; chs.forEach(([a, b]) => { const x = centerOf(a), y = centerOf(b); (adj[x] = adj[x] || new Set()).add(y); (adj[y] = adj[y] || new Set()).add(x); });
    const reach = (from, to) => { const seen = new Set([from]), q = [from]; while (q.length) { const c = q.shift(); if (c === to) return true; (adj[c] || []).forEach(n => { if (!seen.has(n)) { seen.add(n); q.push(n); } }); } return false; };
    const motors = ["Sacral", "Heart", "SolarPlexus", "Root"];
    const motorThroat = motors.some(m => dc.has(m) && reach(m, "Throat"));
    let type;
    if (dc.size === 0) type = "Reflector";
    else if (dc.has("Sacral")) type = motorThroat ? "Manifesting Generator" : "Generator";
    else type = motorThroat ? "Manifestor" : "Projector";
    let authority = "None (outer)";
    if (dc.has("SolarPlexus")) authority = "Emotional";
    else if (dc.has("Sacral")) authority = "Sacral";
    else if (dc.has("Spleen")) authority = "Splenic";
    else if (dc.has("Heart")) authority = "Ego";
    else if (dc.has("G")) authority = "Self-projected";
    else if (type === "Projector") authority = "Mental (environmental)";
    else if (type === "Reflector") authority = "Lunar";
    return { type, authority, defined: [...dc] };
  }
  function natalChart(birth, lat, lon) {
    const p = positions(birth), h = houses(birth, lat, lon);
    const dd = designDate(birth);
    const pers = activations(birth), des = activations(dd);
    const G = new Set([...gatesOf(pers), ...gatesOf(des)]);
    const chs = channelsOf(G);
    const t = hdType(chs);
    return { birth, lat, lon, positions: p, houses: h, designDate: dd, personality: pers, design: des, gates: G, channels: chs, ...t, profile: pers.Sun.line + "/" + des.Sun.line };
  }
  // ---------- Aspects ----------
  const ASPECTS = [[0, "conjunct"], [60, "sextile"], [90, "square"], [120, "trine"], [180, "opposite"]];
  const ORB = { Moon: 4, Sun: 2, Mercury: 2, Venus: 2, Mars: 2, Jupiter: 2, Saturn: 1.5, Uranus: 1.5, Neptune: 1.5, Pluto: 1.5, NNode: 1 };
  function transitAspects(tr, natal) {
    const nat = { ...Object.fromEntries(Object.entries(natal.positions).map(([k, v]) => [k, v.lon])), ASC: natal.houses.asc, MC: natal.houses.mc };
    const out = [];
    for (const [tn, tv] of Object.entries(tr)) for (const [nn, nl] of Object.entries(nat)) {
      const d = Math.abs(sdiff(tv.lon, nl));
      for (const [a, name] of ASPECTS) {
        const orb = Math.abs(d - a);
        if (orb <= ORB[tn]) {
          const d2 = Math.abs(sdiff(tv.lon + tv.speed * 0.01, nl));
          out.push({ t: tn, aspect: name, n: nn, orb, applying: Math.abs(d2 - a) < orb });
        }
      }
    }
    return out.sort((a, b) => a.orb - b.orb);
  }
  // exact transit dates in the next N days
  function upcoming(natal, from, days) {
    const nat = { ...Object.fromEntries(Object.entries(natal.positions).map(([k, v]) => [k, v.lon])), ASC: natal.houses.asc, MC: natal.houses.mc };
    const res = [];
    for (const tn of ["Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]) {
      const step = 4;
      const series = [];
      for (let h = 0; h <= days * 24; h += step) series.push([h, lonOf(tn, new Date(from.getTime() + h * 3600e3))]);
      for (const [nn, nl] of Object.entries(nat)) for (const [a, name] of ASPECTS) {
        for (const tgt of (a === 0 || a === 180) ? [nl + a] : [nl + a, nl - a]) {
          let prev = null;
          for (const [h, l] of series) {
            const v = sdiff(l, tgt);
            if (prev !== null && Math.sign(prev) !== Math.sign(v) && Math.abs(v) < 5) res.push({ date: new Date(from.getTime() + h * 3600e3), t: tn, aspect: name, n: nn });
            prev = v;
          }
        }
      }
    }
    return res.sort((a, b) => a.date - b.date);
  }
  // ---------- Moon ----------
  function moonPhase(date) {
    const t = A.MakeTime(date);
    const el = A.MoonPhase(t);
    const illum = (1 - Math.cos(el * D2R)) / 2;
    const names = ["New Moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full Moon", "Waning gibbous", "Last quarter", "Waning crescent"];
    const idx = Math.floor(norm(el + 22.5) / 45) % 8;
    const nextFull = A.SearchMoonPhase(180, t, 40).date, nextNew = A.SearchMoonPhase(0, t, 40).date;
    return { elong: el, illum, name: names[idx], nextFull, nextNew, fullLon: lonOf("Moon", nextFull) };
  }
  function moonGateTimeline(dayStart) { // gate changes over 24h from dayStart
    const seq = []; let last = null;
    for (let m = 0; m <= 1440; m += 5) { const g = gateOf(lonOf("Moon", new Date(dayStart.getTime() + m * 60e3))).gate; if (g !== last) { seq.push({ min: m, gate: g }); last = g; } }
    return seq;
  }
  // ---------- Numerology ----------
  const digitsum = n => String(n).split("").reduce((s, d) => s + +d, 0);
  function reduce(n, keepMaster) { while (n > 9 && !(keepMaster && [11, 22, 33].includes(n))) n = digitsum(n); return n; }
  function numerology(by, bm, bd, y, m, d) {
    const lp = reduce(digitsum(`${by}${String(bm).padStart(2, "0")}${String(bd).padStart(2, "0")}`), true);
    const py = reduce(reduce(bm) + reduce(bd) + reduce(y));
    const pyFull = reduce(digitsum(`${bm}${bd}${y}`), true);
    const pm = reduce(py + m), pd = reduce(pm + d);
    const ud = reduce(digitsum(`${y}${m}${d}`));
    return { lifePath: lp, personalYear: py, personalYearFull: pyFull, personalMonth: pm, personalDay: pd, universalDay: ud };
  }
  // ---------- BaZi ----------
  const STEMS = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];
  const STEMS_ZH = "甲乙丙丁戊己庚辛壬癸", BR_ZH = "子丑寅卯辰巳午未申酉戌亥";
  const STEM_EL = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
  const BRANCHES = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];
  const ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const pillar = i => ({ stem: i % 10, branch: i % 12, name: `${STEMS[i % 10]} ${BRANCHES[i % 12]}`, zh: STEMS_ZH[i % 10] + BR_ZH[i % 12], desc: `${i % 10 % 2 ? "Yin" : "Yang"} ${STEM_EL[i % 10]} ${ANIMALS[i % 12]}` });
  const daysFromEpoch = (y, m, d) => Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2000, 0, 1)) / 86400e3);
  function dayPillarIndex(y, m, d) { return (((daysFromEpoch(y, m, d) + 54) % 60) + 60) % 60; }
  function baziFull(date, y, m, d, hourLocalSolar) {
    const sl = lonOf("Sun", date);
    let yy = y; const monthNo = Math.floor(norm(sl - 315) / 30); // 0 = Yin month
    if (m <= 2 && monthNo >= 10) yy = y - 1; // before Lichun
    const yIdx = (((yy - 1984) % 60) + 60) % 60;
    const yStem = yIdx % 10;
    const mStem = ((yStem % 5) * 2 + 2 + monthNo) % 10, mBranch = (monthNo + 2) % 12;
    let mIdx = 0; for (let i = 0; i < 60; i++) if (i % 10 === mStem && i % 12 === mBranch) mIdx = i;
    let dd = [y, m, d];
    let dIdx = dayPillarIndex(...dd);
    const out = { year: pillar(yIdx), month: pillar(mIdx), day: pillar(dIdx) };
    if (hourLocalSolar != null) {
      const hb = Math.floor(((hourLocalSolar + 1) % 24) / 2);
      const hs = ((dIdx % 10) % 5 * 2 + hb) % 10;
      let hIdx = 0; for (let i = 0; i < 60; i++) if (i % 10 === hs && i % 12 === hb) hIdx = i;
      out.hour = pillar(hIdx);
    }
    return out;
  }
  const PRODUCES = { Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood" };
  const CONTROLS = { Wood: "Earth", Earth: "Water", Water: "Fire", Fire: "Metal", Metal: "Wood" };
  function tenGod(dm, other) {
    const a = STEM_EL[dm], b = STEM_EL[other], same = dm % 2 === other % 2;
    if (a === b) return same ? "Friend" : "Rob Wealth";
    if (PRODUCES[a] === b) return same ? "Eating God" : "Hurting Officer";
    if (CONTROLS[a] === b) return same ? "Indirect Wealth" : "Direct Wealth";
    if (CONTROLS[b] === a) return same ? "Seven Killings" : "Direct Officer";
    if (PRODUCES[b] === a) return same ? "Indirect Resource" : "Direct Resource";
  }
  function branchRelation(a, b) {
    const pairs = (list, name) => list.some(([x, y]) => (x === a && y === b) || (x === b && y === a)) ? name : null;
    return pairs([[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]], "Clash") || pairs([[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]], "Combination") ||
      pairs([[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]], "Harm") || (a === b ? "Same branch" : null);
  }
  // equation of time (minutes), simple formula
  function eot(date) { const N = (date - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86400e3; const B = 2 * Math.PI * (N - 81) / 364; return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); }
  // ---------- Biorhythm ----------
  function biorhythm(birthYMD, ymd) { const n = daysFromEpoch(...ymd) - daysFromEpoch(...birthYMD); return { days: n, physical: Math.sin(2 * Math.PI * n / 23), emotional: Math.sin(2 * Math.PI * n / 28), intellectual: Math.sin(2 * Math.PI * n / 33) }; }
  // ---------- Planetary hours (Chaldean order, sunrise to sunrise) ----------
  function planetaryHours(y, m, d, tz, lat, lon) {
    const obs = new A.Observer(lat, lon, 0);
    const midnight = zoned(y, m, d, 0, 0, tz);
    const sr = A.SearchRiseSet(A.Body.Sun, obs, +1, A.MakeTime(midnight), 1);
    if (!sr) return null;
    const ss = A.SearchRiseSet(A.Body.Sun, obs, -1, sr, 1), sr2 = A.SearchRiseSet(A.Body.Sun, obs, +1, ss, 1);
    const CH = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"], WD = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    const ruler = WD[wd], s0 = CH.indexOf(ruler);
    const a = sr.date.getTime(), b = ss.date.getTime(), c = sr2.date.getTime(), dl = (b - a) / 12, nl = (c - b) / 12;
    const hours = [];
    for (let i = 0; i < 24; i++) { const st = i < 12 ? a + i * dl : b + (i - 12) * nl; hours.push({ n: i + 1, start: new Date(st), end: new Date(st + (i < 12 ? dl : nl)), planet: CH[(s0 + i) % 7], day: i < 12 }); }
    return { ruler, sunrise: sr.date, sunset: ss.date, hours };
  }
  // ---------- helpers ----------
  function zoned(y, m, d, hh, mm, tz) { // local wall time in IANA tz -> Date
    let guess = Date.UTC(y, m - 1, d, hh, mm);
    for (let i = 0; i < 3; i++) {
      const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(guess)).reduce((o, x) => (o[x.type] = x.value, o), {});
      const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
      guess += Date.UTC(y, m - 1, d, hh, mm) - asUTC;
    }
    return new Date(guess);
  }
  function fmtLon(l) { const s = Math.floor(norm(l) / 30), x = norm(l) % 30; return `${Math.floor(x)}°${String(Math.floor((x % 1) * 60)).padStart(2, "0")}′ ${SIGNS[s]}`; }
  return { lonOf, positions, houses, houseOf, gateOf, activations, gatesOf, channelsOf, definedCenters, centerOf, designDate, hdType, natalChart, transitAspects, upcoming, moonPhase, moonGateTimeline, numerology, baziFull, dayPillarIndex, pillar, tenGod, branchRelation, eot, biorhythm, planetaryHours, zoned, fmtLon, norm, sdiff, SIGNS, CENTERS, CHANNELS, STEM_EL, STEMS };
});
