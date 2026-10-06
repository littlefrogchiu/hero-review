/* 305 英語段考複習 — app */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const L = ['A', 'B', 'C', 'D'];

/* ---------- units ---------- */
const UNITS = [
  { id: 'L1', no: 'L1', ls: [1], title: 'Have You Ever Tried These Dishes?', zh: '聽食物說故事', gram: '現在完成式（ever / already / yet、for / since、have been to / gone to）' },
  { id: 'L2', no: 'L2', ls: [2], title: 'Are You Interested in Trying Food Delivery Apps?', zh: '外送美味超輕鬆', gram: '分詞當形容詞（-ing / -ed）、that 名詞子句' },
  { id: 'R1', no: 'R1', ls: [1, 2], rv: 'R1', title: 'Review 1', zh: '第一、二課總複習', gram: 'L1 現在完成式 ＋ L2 分詞形容詞、that 名詞子句' },
  { id: 'L3', no: 'L3', ls: [3], title: "Men and Women Can Do the Same Jobs, Can't They?", zh: '性別不設限', gram: '被動語態、附加問句' },
  { id: 'L4', no: 'L4', ls: [4], title: 'Do You Know What These Words Mean?', zh: '字字有來頭', gram: 'wh- 名詞子句、wh- 不定詞、whether / if 名詞子句' },
  { id: 'R2', no: 'R2', ls: [3, 4], rv: 'R2', title: 'Review 2', zh: '第三、四課總複習', gram: 'L3 被動語態、附加問句 ＋ L4 名詞子句' },
  { id: 'L5', no: 'L5', ls: [5], title: 'The Amazing Candy That Cleans Your Teeth', zh: '吃糖不會蛀牙', gram: '介系詞片語後位修飾、關係子句（關代當主詞）' },
  { id: 'L6', no: 'L6', ls: [6], title: 'Are You One of the Customers Who Companies Trick?', zh: '數字迷思', gram: '關係子句（關代當受詞）、關代所有格 whose' },
  { id: 'R3', no: 'R3', ls: [5, 6], rv: 'R3', title: 'Review 3', zh: '第五、六課總複習', gram: 'L5 關係子句（主格）＋ L6 關係子句（受格）、whose' }
];
const unitOf = id => UNITS.find(u => u.id === id);

/* ---------- games ---------- */
const GAMES = {
  vocab:   { lv: 'l1', lvT: 'Level 1・暖身', ic: '🔤', name: '單字速選', en: 'Vocabulary', time: 10, desc: '看英文選中文，三選一。字詞例句表的單字全部都會出現。' },
  grammar: { lv: 'l2', lvT: 'Level 2・進階', ic: '✏️', name: '文法選擇', en: 'Grammar', time: 20, desc: '本課文法選擇題，20 秒內選出正確答案。' },
  fix:     { lv: 'l3', lvT: 'Level 3・挑戰', ic: '🔍', name: '文法糾錯', en: 'Error correction', time: 25, desc: '會考低答對率考題改編：先找出錯處，再選出正確答案。' },
  news:    { lv: 'l4', lvT: 'Level 4・實戰', ic: '📰', name: '新聞句解讀', en: 'Real-world English', time: 30, desc: '國際新聞的真實句子，看懂本課文法，選出正確的中文翻譯。' },
  order:   { lv: 'lx', lvT: 'Review', ic: '🧩', name: '句子重組', en: 'Sentence order', time: 30, desc: '看中文，把打散的單字排回課文句子。' },
  passage: { lv: 'lx', lvT: 'Review', ic: '📄', name: '課文排序', en: 'Paragraph order', time: 0, desc: '看整篇中文，把打散的課文句子排回正確順序，不限時。' },
  verb:    { lv: 'lc', lvT: '共通練習', ic: '🔁', name: '不規則動詞三態', en: 'Irregular verbs', time: 10, desc: '看三態選中文，或看原形選出過去式／過去分詞。' },
  book:    { lv: 'l3', lvT: '錯題本', ic: '📕', name: '錯題練習', en: 'Review mistakes', time: 0, desc: '' },
  poly:    { lv: 'lc', lvT: '共通練習', ic: '🔀', name: '一字多義', en: 'Multiple meanings', time: 15, desc: '同一個字在不同句子裡意思不同，看例句選出它的意思。' }
};

/* ---------- storage / rank ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('hr_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('hr_' + k, JSON.stringify(v)); } catch (e) {} }
};
const RANKS = [0, 300, 800, 1500, 2500, 4000, 6000, 8500, 12000, 16000].map((at, i) => ({ n: 'Lv.' + (i + 1), at }));
const coins = () => store.get('coins', 0);
const rankOf = c => { let r = 0; RANKS.forEach((x, i) => { if (c >= x.at) r = i; }); return r; };
function rankCard() {
  const c = coins(), r = rankOf(c), R = RANKS[r], N = RANKS[r + 1];
  const pct = N ? Math.round((c - R.at) / (N.at - R.at) * 100) : 100;
  const done = UNITS.reduce((s, u) => s + (u.rv ? ['vocab', 'grammar', 'fix', 'news', 'order', 'passage'] : ['vocab', 'grammar', 'fix', 'news']).reduce((t, g) => t + (store.get(bestKey(u.id, g), null) ? 1 : 0), 0), 0);
  return `<div class="rank"><div class="lvbadge">${R.n}</div>
    <div style="flex:1;min-width:0"><div class="nm">經驗值 ${c} <span class="muted" style="font-size:14px;font-weight:400">XP</span></div>
    <div class="sub">${N ? `再 ${N.at - c} XP 升到 ${N.n}` : '已達最高等級'}・已完成 ${done} 項練習・錯題本 ${Book.count()} 題</div>
    <div class="xpbar"><i style="width:${pct}%"></i></div></div></div>`;
}
function topbar() {
  const c = coins(), R = RANKS[rankOf(c)];
  $('#rk').innerHTML = `${R.n}・<span class="coin">${c} XP</span>`;
}
const bestKey = (u, g) => `best_${u}_${g}`;
function stars(acc) { return acc >= 90 ? 3 : acc >= 70 ? 2 : acc >= 40 ? 1 : 0; }
function starStr(n) { return '★'.repeat(n) + `<i>${'★'.repeat(3 - n)}</i>`; }

/* ---------- audio ---------- */
let AC;
function beep(ok) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain(); o.connect(g); g.connect(AC.destination);
    const t = AC.currentTime; o.type = ok ? 'triangle' : 'sawtooth';
    o.frequency.setValueAtTime(ok ? 660 : 200, t); if (ok) o.frequency.setValueAtTime(990, t + .08);
    g.gain.setValueAtTime(.08, t); g.gain.exponentialRampToValueAtTime(.001, t + (ok ? .25 : .3));
    o.start(t); o.stop(t + .3);
  } catch (e) {}
}
function speak(t) {
  try {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t.replace(/[“”]/g, '"')); u.lang = 'en-US'; u.rate = .9;
    const v = speechSynthesis.getVoices().find(v => /en[-_]US/i.test(v.lang)); if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) {}
}
document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) speak(b.dataset.say); });


function banner(html) {
  const k = $('#kill'); k.innerHTML = html; k.classList.remove('go'); void k.offsetWidth; k.classList.add('go');
}

/* ---------- timer ---------- */
let TM = null;
function startTimer(sec, onEnd) {
  stopTimer(); if (!sec) return;
  const bar = $('.timer i'), lab = $('.tleft'), t0 = performance.now();
  const tick = () => {
    const left = Math.max(0, sec - (performance.now() - t0) / 1000);
    if (bar) { bar.style.transform = `scaleX(${left / sec})`; bar.parentNode.classList.toggle('warn', left < 4); }
    if (lab) lab.textContent = Math.ceil(left);
    if (left <= 0) { stopTimer(); onEnd(); return; }
    TM = requestAnimationFrame(tick);
  };
  TM = requestAnimationFrame(tick);
  return () => Math.max(0, sec - (performance.now() - t0) / 1000);
}
function stopTimer() { if (TM) cancelAnimationFrame(TM); TM = null; }

/* ---------- question builders ---------- */
function vocabFor(u) { return u.ls.flatMap(n => WORDS[n].map(w => ({ ...w, l: n }))); }
function buildQuestions(u, g) {
  if (g === 'vocab') {
    const ws = vocabFor(u);
    return shuffle(ws).map(w => {
      const pool = shuffle(ws.filter(x => x.zh !== w.zh && x.en !== w.en)).slice(0, 2).map(x => x.zh);
      const o = shuffle([w.zh, ...pool]);
      return { kind: 'vocab', l: w.l, w, o, a: o.indexOf(w.zh) };
    });
  }
  if (g === 'grammar') return shuffle(u.ls.flatMap(n => BANK[n].grammar.map(q => ({ kind: 'grammar', l: n, ...q }))));
  if (g === 'fix') {
    const all = u.ls.flatMap(n => BANK[n].fix.map(f => ({ kind: 'fix', l: n, ...f })));
    // 會考題依答對率由低到高先上場，其餘隨機
    const real = all.filter(f => f.p).sort((a, b) => a.p - b.p), other = shuffle(all.filter(f => !f.p));
    const out = []; let i = 0, j = 0;
    while (i < real.length || j < other.length) { if (i < real.length) out.push(real[i++]); if (j < other.length) out.push(other[j++]); }
    return out;
  }
  if (g === 'news') return shuffle(u.ls.flatMap(n => (NEWS[n] || []).map(q => ({ kind: 'news', l: n, ...q }))));
  if (g === 'order') return shuffle(REVIEW[u.rv].sents).map(s => ({ kind: 'order', r: u.rv, ...s }));
  if (g === 'verb') {
    const qs = [];
    VERBS.forEach(v => {
      const others = shuffle(VERBS.filter(x => x[3] !== v[3])).slice(0, 2).map(x => x[3]);
      const o = shuffle([v[3], ...others]);
      qs.push({ kind: 'verb3', v, o, a: o.indexOf(v[3]) });
      if (v[1] !== v[2] && !v[2].includes('/') && v[4] !== 'be') {
        const ask = Math.random() < .5 ? 1 : 2, o2 = shuffle([v[1], v[2]]);
        qs.push({ kind: 'verbF', v, ask, o: o2, a: o2.indexOf(v[ask]) });
      }
    });
    return pick(qs, 20);
  }
  if (g === 'poly') return pick(POLY, 20).map(p => { const o = shuffle([p[2], p[3], p[4]]); return { kind: 'poly', w: p[0], s: p[1], o, a: o.indexOf(p[2]) }; });
  return [];
}

/* ---------- views ---------- */
function home() {
  stopTimer();
  app.innerHTML = `
  <section class="hero">
    <div class="kicker">九上英語・康軒 Book 5・段考複習</div>
    <h1><span class="cls">305</span> 英語段考複習</h1>
    <p>九個單元，每單元四個等級由易到難。可以自己練，也可以和同學 1 vs 1。</p>
  </section>
  <div class="card frame">${rankCard()}</div>
  <div class="sec"><h2>單元</h2><small>每課一個單元・每兩課一個 Review</small></div>
  <div class="units">${UNITS.map(u => {
    const gs = u.rv ? ['vocab', 'grammar', 'fix', 'news', 'order', 'passage'] : ['vocab', 'grammar', 'fix', 'news'];
    const st = gs.reduce((s, g) => s + (store.get(bestKey(u.id, g), null)?.stars || 0), 0), mx = gs.length * 3;
    return `<a class="unit ${u.rv ? 'rv' : ''}" href="#/u/${u.id}">
      <span class="stars">${st} / ${mx} ★</span>
      <div class="no">${u.rv ? 'Review ' + u.no.slice(1) : 'Lesson ' + u.no.slice(1)}</div>
      <h3>${esc(u.rv ? u.zh : u.title)}</h3><p>${u.rv ? '' : esc(u.zh) + '｜'}${esc(u.gram)}</p></a>`;
  }).join('')}</div>
  ${crossSection()}`;
}
function missionCard(uid, g) {
  const G = GAMES[g], b = store.get(bestKey(uid, g), null);
  const u = unitOf(uid);
  let count = '';
  if (u) {
    if (g === 'vocab') count = vocabFor(u).length + ' 字';
    if (g === 'grammar') count = u.ls.reduce((s, n) => s + BANK[n].grammar.length, 0) + ' 題';
    if (g === 'fix') count = u.ls.reduce((s, n) => s + BANK[n].fix.length, 0) + ' 題';
    if (g === 'news') count = u.ls.reduce((s, n) => s + (NEWS[n] || []).length, 0) + ' 句';
    if (g === 'order') count = REVIEW[u.rv].sents.length + ' 句・' + REVIEW[u.rv].page;
    if (g === 'passage') count = REVIEW[u.rv].sents.length + ' 句・' + REVIEW[u.rv].page;
  } else count = g === 'verb' ? VERBS.length + ' 個動詞' : POLY.length + ' 題庫';
  return `<a class="mission ${G.lv}" href="#/play/${uid}/${g}">
    <div class="lv"><span class="ic">${G.ic}</span>${G.lvT}</div>
    <h3>${G.name}</h3><div class="en">${G.en}</div>
    <p>${G.desc}</p>
    <div class="meta"><span class="chip">${G.time ? '⏱ ' + G.time + ' 秒/題' : '♾ 不限時'}</span><span class="chip">${count}</span>
      ${b ? `<span class="best">${starStr(b.stars)}</span>` : ''}</div></a>`;
}
function crossSection() {
  return `<div class="sec"><h2>共通練習</h2><small>每個單元都適用</small></div>
  <div class="missions" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">${missionCard('ALL', 'verb')}${missionCard('ALL', 'poly')}</div>`;
}
function unitView(id) {
  stopTimer();
  const u = unitOf(id); if (!u) return home();
  const extra = u.rv ? `<div class="sec"><h2>Review 練習</h2><small>課本 ${REVIEW[u.rv].page}・${REVIEW[u.rv].lesson}</small></div>
    <div class="missions" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">${missionCard(id, 'order')}${missionCard(id, 'passage')}</div>` : '';
  app.innerHTML = `<div class="crumb"><a href="#/">← 回首頁</a></div>
  <div class="card frame">
    <div class="chip ${u.rv ? 'cyan' : 'acc'}">${u.rv ? 'Review ' + u.no.slice(1) + '・涵蓋 L' + u.ls.join('、L') : 'Lesson ' + u.no.slice(1)}</div>
    <h2 style="margin:8px 0 4px;font-size:22px">${esc(u.title)}</h2>
    <div class="grammarbox">${esc(u.zh)}<br><b>文法重點：</b>${esc(u.gram)}</div>
  </div>
  <div class="sec"><h2>四個等級</h2><small>由易到難</small></div>
  <div class="missions four">${missionCard(id, 'vocab')}${missionCard(id, 'grammar')}${missionCard(id, 'fix')}${missionCard(id, 'news')}</div>
  ${extra}${crossSection()}`;
}

/* --- passage reorder (no time limit) --- */
function passage(u) {
  const R = REVIEW[u.rv], N = R.sents.length;
  let order = shuffle(R.sents.map((s, i) => i));
  if (order.every((x, k) => x === k)) order.reverse();
  const placed = []; let checks = 0, finished = false, mark = null;
  const zhAll = R.sents.map(s => s.zh).join('');
  const draw = () => {
    app.innerHTML = `<div class="hud"><a class="btn sm" href="#/u/${u.id}">←</a><span class="pill">📄 課文排序</span>
      <span class="pill">已排 ${placed.length} / ${N}</span><span class="pill">檢查 ${checks} 次</span></div>
      <div class="qcard"><div class="qhead"><span>${esc(R.lesson)}・${esc(R.page)}・${esc(R.title)}</span><span>♾ 不限時</span></div>
      <p class="muted" style="margin:8px 0 4px;font-size:13px">📜 全文中文（照著中文的順序，把英文句子排好）</p>
      <div class="passage">${esc(zhAll)}</div>
      <div class="sec" style="margin:16px 0 4px"><h2 style="font-size:24px">你的排序</h2><small>點句子可退回</small></div>
      <div class="sl" id="ans">${placed.length ? placed.map((i, j) => `<button class="tile ${mark ? (mark[j] ? 'okk' : 'badd') : ''}" data-j="${j}"><span class="n">${j + 1}</span><span>${esc(R.sents[i].en)}</span></button>`).join('') : '<div class="empty">（從下方依序點選句子）</div>'}</div>
      <div class="sec" style="margin:16px 0 4px"><h2 style="font-size:24px">句子卡</h2><small>依行文順序點選</small></div>
      <div class="sl" id="pool">${order.filter(i => !placed.includes(i)).map(i => `<button class="tile" data-i="${i}"><span class="n">•</span><span>${esc(R.sents[i].en)}</span></button>`).join('') || '<div class="empty">全部放好了！按「檢查」看看。</div>'}</div>
      <div class="btnrow"><button class="btn" id="clr">全部退回</button><button class="btn" id="keep">只留對的</button><button class="btn gold" id="chk" ${placed.length < N ? 'disabled' : ''}>檢查順序</button></div>
      <div id="fb"></div></div>`;
    app.querySelectorAll('#pool .tile').forEach(b => b.onclick = () => { if (finished) return; placed.push(+b.dataset.i); mark = null; draw(); });
    app.querySelectorAll('#ans .tile').forEach(b => b.onclick = () => { if (finished) return; placed.splice(+b.dataset.j, 1); mark = null; draw(); });
    $('#clr').onclick = () => { if (finished) return; placed.length = 0; mark = null; draw(); };
    $('#keep').onclick = () => {
      if (finished) return;
      // 保留從第一句開始連續排對的部分
      let k = 0; while (k < placed.length && placed[k] === k) k++;
      placed.length = k; mark = null; draw();
    };
    $('#chk').onclick = () => {
      checks++; mark = placed.map((x, j) => x === j);
      const right = mark.filter(Boolean).length;
      if (right === N) { finished = true; draw(); win(); return; }
      beep(false); draw();
      $('#fb').innerHTML = `<div class="feedback bad">✘ 對了 ${right} / ${N} 句（綠色＝位置正確，紅色＝位置錯誤）。按「只留對的」保留開頭連續正確的部分，再接著排！</div>`;
    };
  };
  function win() {
    beep(true);
    const gain = Math.max(100, 600 - (checks - 1) * 100), acc = Math.max(0, Math.round(100 - (checks - 1) * 25));
    banner('全部排對了');
    store.set('coins', coins() + gain); topbar();
    const k = bestKey(u.id, 'passage'), b = store.get(k, null), st = stars(acc);
    if (!b || st > b.stars || (st === b.stars && gain > b.score)) store.set(k, { stars: st, score: gain, acc });
    $('#fb').innerHTML = `<div class="feedback ok">✔ 全部排對！檢查 ${checks} 次，獲得 <b class="acc">+${gain} XP</b>　${starStr(st)}</div>
      <div class="btnrow"><button class="btn" data-say="${esc(R.sents.map(s => s.en).join(' '))}">🔊 聽全文</button><button class="btn gold" onclick="location.hash='#/solo/${u.id}/passage?'+Date.now()">再玩一次</button><a class="btn" href="#/u/${u.id}">回單元</a></div>`;
  }
  draw();
}


/* ---------- router ---------- */
function route() {
  stopTimer();
  const h = location.hash.replace(/\?.*$/, '');
  let m;
  if (G && G.mode === 'host' && !/^#\/play/.test(h)) closeNet();
  if ((m = h.match(/^#\/u\/(\w+)/))) { closeNet(); unitView(m[1]); }
  else if ((m = h.match(/^#\/play\/(\w+)\/(\w+)/))) prep(m[1], m[2]);
  else if ((m = h.match(/^#\/solo\/(\w+)\/(\w+)/))) solo(m[1], m[2]);
  else if ((m = h.match(/^#\/join\/(\d{4})/))) joinScreen(m[1]);
  else if ((m = h.match(/^#\/book(?:\/(\w+))?/))) bookView(m[1]);
  else { closeNet(); home(); }
  topbar(); updateBookBadge(); window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};
route();
