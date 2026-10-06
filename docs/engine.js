/* 305 英語段考複習 — 練習引擎：題目面板、單人、1v1 對戰、錯題本 */
'use strict';
const KT = { vocab: 10, grammar: 20, fix: 25, news: 30, order: 30, verb3: 10, verbF: 10, poly: 15 };   // 每題秒數
const PAUSE = { vocab: 1700, verb3: 1700, verbF: 1700, poly: 2400, grammar: 3000, news: 4200, fix: 5200, order: 4200 }; // 對戰揭曉停留
const BATTLE_N = { vocab: 12, verb: 12, poly: 10, grammar: 10, fix: 8, news: 8, order: 8 };
const PREFIX = 'hero305-';
const GAME_OF_KIND = { vocab: 'vocab', grammar: 'grammar', fix: 'fix', news: 'news', order: 'order', verb3: 'verb', verbF: 'verb', poly: 'poly' };

/* ---------- 題目 id / 摘要 ---------- */
function qid(q) {
  switch (q.kind) {
    case 'vocab': return 'vocab|' + q.w.en;
    case 'grammar': return 'grammar|' + q.q;
    case 'fix': return 'fix|' + q.t;
    case 'news': return 'news|' + q.en;
    case 'order': return 'order|' + q.en;
    case 'verb3': return 'verb3|' + q.v[0];
    case 'verbF': return 'verbF|' + q.v[0] + '|' + q.ask;
    case 'poly': return 'poly|' + q.w + '|' + q.s;
  }
  return q.kind + '|' + JSON.stringify(q).slice(0, 80);
}
function fixParts(t) {
  const parts = []; let segs = 0;
  t.split(/(\[\[.*?\]\])/).forEach(p => { if (p.startsWith('[[')) parts.push({ seg: segs++, t: p.slice(2, -2) }); else if (p) parts.push({ t: p }); });
  return parts;
}
function summary(q) {
  if (q.kind === 'vocab') return `<b>${esc(q.w.en)}</b> ${esc(q.w.pos)} ${esc(q.w.zh)} <button class="say" data-say="${esc(q.w.en)}">🔊</button><div class="zz">${esc(q.w.ex)}</div>`;
  if (q.kind === 'grammar') return `${esc(q.q).replace(/_{3,}/g, `<b class="ok">${esc(q.o[q.a])}</b>`).replace(/\n/g, ' ')}<div class="zz">${esc(q.tip || '')}</div>`;
  if (q.kind === 'fix') return `${fixParts(q.t).map(p => p.seg == null ? esc(p.t) : p.seg === q.e ? `<s class="bad">${esc(p.t)}</s> <b class="ok">${esc(q.o[q.a])}</b>` : esc(p.t)).join('').replace(/\n/g, ' ')}<div class="zz">${esc(q.tip || '')}</div>`;
  if (q.kind === 'news') return `${esc(q.en)}<div class="zz">${esc(q.o[q.a])}（${esc(q.outlet)}）</div>`;
  if (q.kind === 'order') return `${esc(q.en)}<div class="zz">${esc(q.zh)}</div>`;
  if (q.kind === 'verb3' || q.kind === 'verbF') return `<b>${esc(q.v[0])} – ${esc(q.v[1])} – ${esc(q.v[2])}</b>　${esc(q.v[3])}`;
  if (q.kind === 'poly') return `${esc(q.s)}<div class="zz">${esc(q.w)}：${esc(q.o[q.a])}</div>`;
  return '';
}
function scoreOf(q, res, frac) {
  const base = q.kind === 'fix' ? 150 : 100;
  if (res.ok) return Math.round(base * (0.6 + 0.4 * Math.max(0, Math.min(1, frac))));
  return res.half ? 40 : 0;
}

/* ---------- 錯題本 ---------- */
const Book = {
  all() { return store.get('book', {}); },
  save(b) { store.set('book', b); updateBookBadge(); },
  add(q, uid) {
    if (!q || q.kind === 'passage') return;
    const b = this.all(), id = qid(q), e = b[id];
    const where = e ? e.where : q.l ? 'L' + q.l : q.r ? q.r : (q.kind === 'verb3' || q.kind === 'verbF') ? 'VERB' : q.kind === 'poly' ? 'POLY' : uid;
    b[id] = { id, q, where, g: GAME_OF_KIND[q.kind], n: (e ? e.n : 0) + 1, t: Date.now() };
    this.save(b);
  },
  remove(id) { const b = this.all(); delete b[id]; this.save(b); },
  count() { return Object.keys(this.all()).length; }
};
function updateBookBadge() { const el = $('#bookN'); if (el) { const n = Book.count(); el.textContent = n; el.style.display = n ? '' : 'none'; } }

/* ---------- 題目面板（單人、對戰、分割畫面共用） ---------- */
function panel(el, q, opt) {
  const ctl = { done: false, res: null, t0: performance.now() };
  const finish = res => { if (ctl.done) return; ctl.done = true; res.ms = Math.round(performance.now() - ctl.t0); ctl.res = res; opt.onDone && opt.onDone(res); };
  const optsHtml = (cls, extra) => `<div class="opts ${extra || ''}">${q.o.map((o, k) => `<button data-k="${k}"><b>${L[k]}</b><span class="${cls}">${esc(o)}</span></button>`).join('')}</div>`;
  let body = '';
  if (q.kind === 'fix') {
    body = `<div class="stage"><span class="on" data-st="1">① 揪出錯處</span><span data-st="2">② 選出正解</span>
        ${q.p && !opt.compact ? `<span class="chip red" style="margin-left:auto">會考答對率 ${Math.round(q.p * 100)}%</span>` : ''}</div>
      <p class="muted ins" style="margin:8px 0 0">三個畫線處有一處錯誤，點出錯的地方。</p>
      <div class="fixs">${fixSentence(q)}</div><div class="s2"></div>`;
  } else if (q.kind === 'order') {
    body = `<div class="zh">🀄 ${esc(q.zh)}</div>
      <p class="muted" style="margin:6px 0 0;font-size:13px">依序點字卡排成句子；點上方的字卡可退回。</p>
      <div class="slot"><span class="empty">（點字卡放這裡）</span></div><div class="pool"></div>`;
  } else {
    let head = '', cls = '';
    if (q.kind === 'vocab') head = `<div class="word">${esc(q.w.en)}</div><div class="pos">${esc(q.w.pos || 'phr.')}</div>
      <div class="center" style="margin-top:6px"><button class="say" data-say="${esc(q.w.en)}">🔊 再聽一次</button></div>`;
    else if (q.kind === 'grammar') { head = `<div class="stem">${esc(q.q).replace(/_{3,}/g, '<span class="blank"></span>')}</div>`; cls = 'en'; }
    else if (q.kind === 'verb3') head = `<p class="muted center" style="margin:10px 0 0">這組三態是哪個字？選出中文意思</p>
      <div class="word" style="font-size:clamp(24px,6.5vw,40px)">${esc(q.v[0])} <span class="muted">–</span> ${esc(q.v[1])} <span class="muted">–</span> ${esc(q.v[2])}</div>
      <div class="center" style="margin-top:6px"><button class="say" data-say="${esc(q.v.slice(0, 3).join(', '))}">🔊 唸三態</button></div>`;
    else if (q.kind === 'verbF') { head = `<div class="word">${esc(q.v[0])}</div><div class="pos">${esc(q.v[3])}</div>
      <p class="center" style="font-size:18px;margin:10px 0 0">請選出 <b class="gold">${q.ask === 1 ? '過去式' : '過去分詞'}</b></p>`; cls = 'en'; }
    else if (q.kind === 'news') head = `<div class="newsrc">📰 <b>${esc(q.outlet)}</b>${q.date ? '・' + esc(q.date) : ''}　<a href="${esc(q.url)}" target="_blank" rel="noopener">${esc(q.title || '原文連結')} ↗</a></div>
      <div class="stem news">${esc(q.en)}</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="say" data-say="${esc(q.en)}">🔊 聽新聞句</button><span class="chip">文法：${esc(q.gz)}</span></div>
      <p class="muted" style="margin:10px 0 0;font-size:14px">哪一個是正確的中文翻譯？</p>`;
    else if (q.kind === 'poly') {
      const irr = { light: 'lit', lead: 'led', swing: 'swung', shake: 'shook', grow: 'grew', keep: 'kept', leave: 'left', mean: 'meant', stand: 'stood', fall: 'fell', fly: 'flew', ring: 'rang' };
      const re = new RegExp('\\b(' + q.w + '\\w*|' + q.w.slice(0, -1) + '\\w*' + (irr[q.w] ? '|' + irr[q.w] : '') + ')\\b', 'i');
      head = `<p class="muted" style="margin:10px 0 0">句中 <b class="gold">${esc(q.w)}</b> 是什麼意思？</p>
        <div class="stem">${esc(q.s).replace(re, '<b class="gold" style="border-bottom:2px solid var(--gold)">$1</b>')}</div>
        <button class="say" data-say="${esc(q.s)}">🔊 聽例句</button>`;
    }
    body = head + optsHtml(cls, q.kind === 'verbF' ? 'two' : '');
  }
  el.innerHTML = body + '<div class="pfb"></div>';
  const $$ = s => el.querySelectorAll(s);

  if (q.kind === 'fix') {
    ctl.s1 = null;
    $$('.seg').forEach(b => b.onclick = () => {
      if (ctl.s1 !== null || ctl.done) return;
      const s = +b.dataset.s; ctl.s1 = s === q.e;
      $$('.seg').forEach(x => { x.disabled = true; if (+x.dataset.s === q.e) x.classList.add(ctl.s1 ? 'picked' : 'err'); });
      if (!ctl.s1) { b.classList.add('shake'); b.style.borderColor = 'var(--muted)'; }
      beep(ctl.s1);
      el.querySelector('[data-st="1"]').className = 'done'; el.querySelector('[data-st="2"]').className = 'on';
      el.querySelector('.ins').innerHTML = ctl.s1 ? '✔ 找到了。現在選出正確的寫法：' : `✘ 錯處其實在 <b class="bad">${'①②③'[q.e]}</b>。接著選出正確的寫法。`;
      el.querySelector('.s2').innerHTML = optsHtml('en');
      el.querySelectorAll('.s2 .opts button').forEach(x => x.onclick = () => {
        const k = +x.dataset.k;
        el.querySelectorAll('.s2 .opts button').forEach(y => y.disabled = true); x.classList.add('pick');
        finish({ s1: ctl.s1, k, ok: ctl.s1 && k === q.a, half: !ctl.s1 && k === q.a });
      });
    });
  } else if (q.kind === 'order') {
    const C = chipsOf(q);
    let tiles = shuffle(C.chips.map((t, i) => ({ t, i })));
    if (tiles.length > 1 && tiles.every((x, k) => x.i === k)) tiles.reverse();
    const placed = [];
    const pool = el.querySelector('.pool'), slot = el.querySelector('.slot');
    pool.innerHTML = tiles.map((x, k) => `<button class="tile" data-k="${k}">${esc(x.t)}</button>`).join('');
    const draw = () => {
      slot.innerHTML = placed.length ? placed.map((k, j) => `<button class="tile" data-j="${j}">${esc(tiles[k].t)}</button>`).join('') + `<span class="endp">${esc(C.end)}</span>` : '<span class="empty">（點字卡放這裡）</span>';
      pool.querySelectorAll('.tile').forEach(b => b.classList.toggle('used', placed.includes(+b.dataset.k)));
      slot.querySelectorAll('.tile').forEach(b => b.onclick = () => { if (ctl.done) return; placed.splice(+b.dataset.j, 1); draw(); });
    };
    pool.querySelectorAll('.tile').forEach(b => b.onclick = () => {
      if (ctl.done || placed.includes(+b.dataset.k)) return;
      placed.push(+b.dataset.k); draw();
      if (placed.length === tiles.length) setTimeout(() => finish({ ok: placed.map(k => tiles[k].t).join(' ') === C.answer }), 150);
    });
  } else {
    $$('.opts button').forEach(b => b.onclick = () => {
      if (ctl.done) return;
      const k = +b.dataset.k;
      $$('.opts button').forEach(x => x.disabled = true); b.classList.add('pick');
      finish({ k, ok: k === q.a });
    });
  }

  ctl.timeout = () => {
    if (ctl.done) return;
    $$('button.seg, .opts button, .tile').forEach(b => b.disabled = true);
    finish(q.kind === 'fix' ? { s1: ctl.s1, k: -1, ok: false, half: false, to: true } : { k: -1, ok: false, to: true });
  };
  // 顯示正解與說明（res = 這個面板玩家的作答結果；note = 額外訊息，例如得分）
  ctl.reveal = (res, note) => {
    res = res || { ok: false, to: true };
    let info = '';
    if (q.kind === 'fix') {
      $$('.seg').forEach(x => { x.disabled = true; if (+x.dataset.s === q.e) x.classList.add('err'); });
      el.querySelectorAll('.s2 .opts button').forEach((b, i) => { b.disabled = true; if (i === q.a) b.classList.add('right'); else if (i === res.k) b.classList.add('wrong'); });
      const fixed = fixParts(q.t).map(p => p.seg == null ? esc(p.t).replace(/\n/g, '<br>') : p.seg === q.e ? `<span class="seg fixd">${esc(q.o[q.a])}</span>` : `<span>${esc(p.t)}</span>`).join('');
      const src = q.p ? `${esc(q.src)}・全國答對率 <b>${Math.round(q.p * 100)}%</b>${q.trap ? `・當年 <b>${q.trap}%</b> 考生誤選本句錯誤選項` : ''}` : esc(q.src);
      info = `<div class="fixs" style="font-size:17px;margin:6px 0 2px">✅ ${fixed}</div>${esc(q.tip || '')}<span class="src">${src}</span>`;
    } else if (q.kind === 'order') {
      slotMark(el, res.ok);
      info = `<div class="answer">${esc(q.en)} <button class="say" data-say="${esc(q.en)}">🔊</button></div>`;
    } else {
      $$('.opts button').forEach((b, i) => { b.disabled = true; if (i === q.a) b.classList.add('right'); else if (i === res.k) b.classList.add('wrong'); });
      if (q.kind === 'vocab') info = `<b>${esc(q.w.en)}</b> ${esc(q.w.pos)} ${esc(q.w.zh)}<span class="src">📖 ${esc(q.w.ex)} <button class="say" data-say="${esc(q.w.ex)}">🔊</button></span>`;
      if (q.kind === 'grammar') info = esc(q.tip || '');
      if (q.kind === 'verb3' || q.kind === 'verbF') info = `<b>${esc(q.v[0])} – ${esc(q.v[1])} – ${esc(q.v[2])}</b>　${esc(q.v[3])}`;
      if (q.kind === 'poly') info = `<b>${esc(q.w)}</b> 在這句是「${esc(q.o[q.a])}」`;
      if (q.kind === 'news') { info = esc(q.tip || ''); const st = el.querySelector('.stem.news'); if (st) st.innerHTML = esc(q.hl).replace(/\[\[(.*?)\]\]/g, '<mark>$1</mark>'); }
    }
    const head = res.ok ? '✔ 答對' : res.half ? '△ 第二步答對' : res.to && res.k === -1 && !res.s1 ? '⏰ 時間到' : '✘ 答錯';
    el.querySelector('.pfb').innerHTML = `<div class="feedback ${res.ok ? 'ok' : 'bad'}"><b class="${res.ok ? 'ok' : 'bad'}">${head}</b>${note ? '<span class="muted">　' + note + '</span>' : ''}　${info}</div>`;
  };
  if (q.kind === 'vocab' && !opt.mute) speak(q.w.en);
  return ctl;
}
function fixSentence(q) {
  return fixParts(q.t).map(p => p.seg == null ? esc(p.t).replace(/\n/g, '<br>')
    : `<button class="seg" data-s="${p.seg}"><sup>${'①②③'[p.seg]}</sup>${esc(p.t)}</button>`).join('');
}
function chipsOf(s) {
  let en = s.en, end = '';
  if (s.end != null) end = s.end; else { const m = en.match(/[.?!]$/); if (m) { end = m[0]; en = en.slice(0, -1); } }
  const chips = s.chips ? s.chips.split('|') : en.split(' ');
  return { chips, end, answer: chips.join(' ') };
}
function slotMark(el, ok) { const s = el.querySelector('.slot'); if (s) s.classList.add(ok ? 'done-ok' : 'done-bad'); }

/* ---------- 開戰前：選擇玩法 ---------- */
let G = null, peer = null, conn = null;
function prep(uid, g) {
  stopTimer(); closeNet();
  const u = unitOf(uid), M = GAMES[g];
  const back = uid === 'ALL' ? '#/' : '#/u/' + uid;
  const canBattle = g !== 'passage';
  app.innerHTML = `<div class="crumb"><a href="${back}">← 返回</a></div>
  <div class="card frame center">
    <div class="chip">${u ? (u.rv ? 'Review ' : 'Lesson ') + u.no.slice(1) : '共通練習'}</div>
    <div style="font-size:34px;margin-top:6px">${M.ic}</div>
    <h2 style="font-size:28px;margin:2px 0 0;line-height:1.2">${M.name}</h2>
    <div class="muted" style="font-size:13px">${M.lvT}・${M.en}</div>
    <p class="muted" style="margin:8px 0 0">${M.desc}</p>
  </div>
  <div class="modepick">
    <a class="modebtn solo" href="#/solo/${uid}/${g}"><b>單人練習</b><small>自己練，答對累積經驗值</small></a>
    ${canBattle ? `<button class="modebtn duel" id="duel"><b>1 vs 1 對戰</b><small>和同學比賽，${BATTLE_N[g]} 題一局</small></button>` : `<div class="modebtn off"><b>1 vs 1 對戰</b><small>課文排序不限時，僅提供單人模式</small></div>`}
  </div>
  <div id="duelbox"></div>`;
  const d = $('#duel');
  if (d) d.onclick = () => {
    d.classList.add('on');
    $('#duelbox').innerHTML = `<div class="card stack">
      <label class="lbl2">你的暱稱<input class="field" id="nm" maxlength="10" placeholder="例如：Jay" value="${esc(store.get('name', ''))}"></label>
      <button class="btn gold" id="host">📱 建立房間（顯示 QR code）</button>
      <div style="display:flex;gap:8px"><input class="field" id="code" inputmode="numeric" maxlength="4" placeholder="輸入 4 位數房號" style="margin:0">
        <button class="btn" id="join" style="white-space:nowrap">加入</button></div>
      <button class="btn blue" id="local">🤝 同一台平板面對面（不需網路）</button>
      <p class="muted" style="margin:0;font-size:13px">建立房間的人決定單元和遊戲；對手掃 QR code 或輸入房號就能加入。</p></div>`;
    const name = () => { const v = $('#nm').value.trim() || '玩家'; store.set('name', v); return v; };
    $('#host').onclick = () => hostScreen(uid, g, name());
    $('#join').onclick = () => { const c = $('#code').value.replace(/\D/g, ''); if (c.length === 4) { name(); location.hash = '#/join/' + c; } else $('#code').focus(); };
    $('#local').onclick = () => startLocal(uid, g);
    $('#duelbox').scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
}

/* ---------- 單人 ---------- */
function solo(uid, g, qsOverride) {
  stopTimer(); closeNet();
  const u = unitOf(uid) || { id: uid, ls: [] };
  if (g === 'passage') return passage(u);
  const qs = qsOverride || buildQuestions(u, g);
  G = { mode: 'solo', uid, g, u, qs, i: 0, score: 0, right: 0, done: 0, streak: 0, best: 0, wrong: [], first: true };
  if (!qs.length) { app.innerHTML = `<div class="card center"><p>沒有題目可以練習。</p><a class="btn gold" href="#/">回首頁</a></div>`; return; }
  soloNext();
}
function soloHud() {
  const M = GAMES[G.g];
  const back = G.g === 'book' ? '#/book' : G.uid === 'ALL' ? '#/' : '#/u/' + G.uid;
  return `<div class="hud"><a class="btn sm" href="${back}">←</a>
    <span class="pill">${M.ic} ${M.name}</span><span class="pill coin">${G.score} XP</span>
    <span class="pill">✔ ${G.right} / ${G.done}${G.streak >= 3 ? '　連對 ' + G.streak : ''}</span>
    <span class="sp"></span><button class="btn sm" id="quit">結束</button></div>`;
}
function soloNext() {
  if (G.i >= G.qs.length) return soloResult();
  const q = G.qs[G.i], T = KT[q.kind];
  app.innerHTML = `${soloHud()}<div class="qcard"><div class="qhead"><span>第 ${G.i + 1} / ${G.qs.length} 題${G.g === 'book' ? `　<span class="chip">${GAMES[GAME_OF_KIND[q.kind]].name}</span>` : ''}</span><span>⏱ <span class="tleft">${T}</span> 秒</span></div>
    <div class="timer"><i></i></div><div id="pnl"></div><div id="nxr"></div></div>`;
  $('#quit').onclick = () => { stopTimer(); soloResult(); };
  const ctl = panel($('#pnl'), q, { onDone: res => {
    stopTimer();
    const p = scoreOf(q, res, left ? left() / T : 0);
    G.done++;
    if (res.ok) {
      G.right++; G.streak++; G.best = Math.max(G.best, G.streak);
      const bonus = G.streak >= 3 ? 20 : 0; G.score += p + bonus;
      if (G.streak >= 3 && G.streak % 5 === 0 || G.streak === 3) banner('連對 ' + G.streak + ' 題');
      beep(true);
      if (G.g === 'book') Book.remove(qid(q));
    } else {
      G.streak = 0; G.score += p; beep(false); G.wrong.push(q);
      Book.add(q, G.uid);
    }
    let note = res.ok ? `+${p} XP` : p ? `+${p} XP` : '';
    if (G.g === 'book') note += res.ok ? '　已從錯題本移除' : '　仍留在錯題本';
    else if (!res.ok) note += '　已加入錯題本';
    ctl.reveal(res, note);
    $('#nxr').innerHTML = `<div class="nextrow"><button class="btn gold" id="nx">${G.i + 1 >= G.qs.length ? '看結果 →' : '下一題 →'}</button></div>`;
    const go = () => { clearTimeout(auto); G.i++; soloNext(); };
    const autoMs = res.ok && ['vocab', 'verb3', 'verbF', 'poly', 'grammar'].includes(q.kind) ? (q.kind === 'grammar' ? 1600 : 1000) : 0;
    const auto = autoMs ? setTimeout(go, autoMs) : null;
    $('#nx').onclick = go;
  } });
  const left = startTimer(T, () => ctl.timeout());
}
function soloResult() {
  stopTimer();
  if (G.ended) return; G.ended = true;
  const acc = G.done ? Math.round(G.right / G.done * 100) : 0, st = stars(acc), win = acc >= 60 && G.done > 0;
  store.set('coins', coins() + G.score); topbar();
  let newBest = false;
  const full = G.done >= Math.min(G.qs.length, 10);
  if (G.g !== 'book' && full) {
    const k = bestKey(G.uid, G.g), b = store.get(k, null);
    if (!b || st > b.stars || (st === b.stars && G.score > b.score)) { store.set(k, { stars: st, score: G.score, acc }); newBest = true; }
  }
  const back = G.g === 'book' ? '#/book' : G.uid === 'ALL' ? '#/' : '#/u/' + G.uid;
  const rv = G.wrong.map(q => `<li>${summary(q)}</li>`).join('');
  app.innerHTML = `<div class="card frame result">
    <div class="vt">練習完成</div>
    <div class="muted">${acc >= 90 ? '表現很穩，可以挑戰下一個等級。' : acc >= 60 ? '不錯，把錯題再看一次會更穩。' : '先看一下錯題的說明，再練一次。'}　<span class="acc" style="font-size:20px">${starStr(st)}</span></div>
    <div class="stats"><div><b>${G.right}/${G.done}</b><small>答對 / 作答</small></div><div><b>${acc}%</b><small>正確率</small></div>
      <div><b>${G.best}</b><small>最長連對</small></div><div><b>+${G.score}</b><small>XP</small></div></div>
    ${newBest ? '<p class="acc" style="margin:0">新的最佳紀錄</p>' : (!full && G.g !== 'book' ? '<p class="muted" style="margin:0;font-size:13px">（至少完成 10 題才會記錄星等）</p>' : '')}
    ${rv ? `<h3 style="text-align:left;margin:16px 0 0">答錯的題目（${G.wrong.length}）・已加入錯題本</h3><ol class="review">${rv}</ol>` : (G.done ? '<p class="ok">全部答對！</p>' : '')}
    <div class="btnrow"><button class="btn gold" id="again">再練一次</button>${G.wrong.length ? '<button class="btn" id="redo">只練這次的錯題</button>' : ''}
      <a class="btn" href="#/book">錯題本</a><a class="btn" href="${back}">返回</a></div></div>`;
  $('#again').onclick = () => G.g === 'book' ? bookPlay(G.filter) : solo(G.uid, G.g);
  const rd = $('#redo'); if (rd) rd.onclick = () => { const w = shuffle(G.wrong), g = G.g, uid = G.uid; solo(uid, g, w); };
}

/* ---------- 1 vs 1：房主決定一切，加入者只回傳作答 ---------- */
function battleQs(uid, g) {
  const u = unitOf(uid) || { id: uid, ls: [] };
  return buildQuestions(u, g).slice(0, BATTLE_N[g] || 10);
}
function hostScreen(uid, g, myName, tries) {
  closeNet();
  const code = String(Math.floor(1000 + Math.random() * 9000));
  app.innerHTML = `<div class="card center"><p class="muted">建立房間中…</p></div>`;
  G = { mode: 'host', me: 'h', op: 'g', uid, g, names: { h: myName, g: '' } };
  if (!window.Peer) return prepMsg(uid, g, '連線元件載入失敗，請確認網路，或改用「同一台平板面對面」。');
  peer = new Peer(PREFIX + code);
  peer.on('open', () => {
    const url = location.href.split('#')[0] + '#/join/' + code;
    app.innerHTML = `<div class="card frame center stack">
      <div class="muted">${GAMES[g].ic} ${GAMES[g].name}｜${uid === 'ALL' ? '全單元' : uid}</div>
      <div class="qrbox">${qrSvg(url)}</div>
      <div>房號 <span class="code">${code}</span></div>
      <p class="muted" style="margin:0">對手用平板相機掃 QR code，或在對戰畫面輸入房號。</p>
      <p>⏳ 等待對手加入…</p>
      <a class="btn" href="#/play/${uid}/${g}">取消</a></div>`;
  });
  peer.on('connection', c => {
    if (conn && conn.open) { c.on('open', () => { c.send({ t: 'full' }); setTimeout(() => c.close(), 300); }); return; }
    conn = c;
    conn.on('data', d => onHostData(d));
    conn.on('close', lostOpponent);
  });
  peer.on('error', e => {
    if (e.type === 'unavailable-id' && (tries || 0) < 5) return hostScreen(uid, g, myName, (tries || 0) + 1);
    prepMsg(uid, g, '連線失敗（' + e.type + '）。請確認網路，或改用「同一台平板面對面」。');
  });
}
function prepMsg(uid, g, msg) { prep(uid, g); app.insertAdjacentHTML('afterbegin', `<div class="card" style="border-color:var(--red)">⚠️ ${esc(msg)}</div>`); }
function qrSvg(text) { try { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 5, margin: 2, scalable: true }); } catch (e) { return '<p style="color:#000">QR 載入失敗，請用房號加入</p>'; } }
function onHostData(d) {
  if (d.t === 'hello') { G.names.g = d.name || '對手'; hostStart(); }
  else if (d.t === 'ans' && d.i === G.i) recordAnswer('g', d.res);
  else if (d.t === 'quit') hostEnd();
  else if (d.t === 'again' && G.ended) hostStart();
}
function joinScreen(code) {
  stopTimer(); closeNet();
  const saved = store.get('name', '');
  if (!saved) {
    app.innerHTML = `<div class="card frame stack"><h3 style="margin:0">⚔️ 加入房間 ${esc(code)}</h3>
      <label class="lbl2">你的暱稱<input class="field" id="nm" maxlength="10" placeholder="例如：Amy"></label>
      <button class="btn gold" id="go">加入對戰</button></div>`;
    $('#go').onclick = () => { store.set('name', $('#nm').value.trim() || '玩家'); joinScreen(code); };
    return;
  }
  app.innerHTML = `<div class="card center stack"><p>🔌 正在連線到房間 <b>${esc(code)}</b>…</p>
    <button class="btn" id="rename">改暱稱（目前：${esc(saved)}）</button></div>`;
  $('#rename').onclick = () => { store.set('name', ''); joinScreen(code); };
  G = { mode: 'guest', me: 'g', op: 'h', names: { h: '', g: saved } };
  if (!window.Peer) { app.innerHTML = `<div class="card">⚠️ 連線元件載入失敗，請確認網路。</div>`; return; }
  peer = new Peer();
  peer.on('open', () => {
    conn = peer.connect(PREFIX + code, { reliable: true });
    conn.on('open', () => {
      conn.send({ t: 'hello', name: saved });
      app.innerHTML = `<div class="card frame center stack"><div class="vt" style="font-size:30px">✔ 已連線</div><p class="muted">已進入房間，等待房主開始…</p></div>`;
    });
    conn.on('data', onGuestData);
    conn.on('close', lostOpponent);
  });
  peer.on('error', e => {
    app.innerHTML = `<div class="card stack" style="border-color:var(--red)"><b>⚠️ ${e.type === 'peer-unavailable' ? '找不到這個房號，請確認房主的畫面還開著。' : '連線失敗（' + esc(e.type) + '）。'}</b><a class="btn" href="#/">回首頁</a></div>`;
  });
}
function onGuestData(d) {
  if (d.t === 'full') app.innerHTML = `<div class="card stack"><b>這個房間已經有人在對戰了。</b><a class="btn" href="#/">回首頁</a></div>`;
  else if (d.t === 'start') { Object.assign(G, { uid: d.uid, g: d.g, qs: d.qs, names: { h: d.names.h, g: G.names.g }, scores: { h: 0, g: 0 }, log: [], i: -1, ended: false }); countdown(); }
  else if (d.t === 'q') { G.i = d.i; G.res = {}; G.revealed = false; showBattleQ(); }
  else if (d.t === 'st') markOpp();
  else if (d.t === 'rv') { G.res = d.res; G.scores = d.scores; G.log = d.log; G.revealed = true; stopTimer(); showReveal(d.pts); }
  else if (d.t === 'end') { G.scores = d.scores; G.log = d.log; battleResult(); }
}
function send(m) { if (conn && conn.open) conn.send(m); }
function closeNet() { const c = conn, p = peer; conn = null; peer = null; try { c && c.close(); } catch (e) {} try { p && p.destroy(); } catch (e) {} const sp = $('.split'); if (sp) sp.remove(); document.body.classList.remove('splitmode'); }
function lostOpponent() {
  if (!conn) return; conn = null; stopTimer();
  if (!G || G.mode === 'local' || G.ended) return;
  app.innerHTML = `<div class="card frame center stack"><div class="vt" style="font-size:30px">對手已離線</div><a class="btn gold" href="#/">回首頁</a></div>`;
}
function countdown(then) {
  let n = 3;
  const draw = () => { app.innerHTML = `<div class="card frame center" style="margin-top:12vh"><p class="muted">${esc(G.names.h)}　vs　${esc(G.names.g)}<br>${GAMES[G.g].ic} ${GAMES[G.g].name}</p><div class="vt" style="font-size:96px;line-height:1">${n}</div></div>`; };
  draw(); beep(true);
  const id = setInterval(() => { n--; if (n <= 0) { clearInterval(id); then && then(); } else draw(); }, 800);
}
function hostStart() {
  G.qs = battleQs(G.uid, G.g); G.scores = { h: 0, g: 0 }; G.log = []; G.i = -1; G.ended = false;
  send({ t: 'start', uid: G.uid, g: G.g, qs: G.qs, names: G.names });
  countdown(hostNext);
}
function hostNext() {
  if (G.ended) return;
  G.i++;
  if (G.i >= G.qs.length) return hostEnd();
  G.res = {}; G.revealed = false;
  send({ t: 'q', i: G.i });
  showBattleQ();
}
function recordAnswer(who, res) {
  if (G.revealed || G.res[who]) return;
  G.res[who] = res;
  if (G.mode === 'host') { if (who === 'g') markOpp(); else send({ t: 'st' }); }
  if (G.mode === 'local') { const s = document.querySelector(`.half[data-who="${who}"] .lst`); if (s) s.textContent = '✓ 已作答'; }
  if (G.res.h && G.res.g) setTimeout(hostReveal, 350);
}
function hostReveal() {
  if (G.revealed || G.ended) return;
  G.revealed = true; stopTimer();
  const q = G.qs[G.i], T = KT[q.kind], pts = {};
  ['h', 'g'].forEach(w => { const r = G.res[w]; pts[w] = r ? scoreOf(q, r, 1 - r.ms / (T * 1000)) : 0; G.scores[w] += pts[w]; });
  G.log.push({ i: G.i, ok: { h: !!(G.res.h && G.res.h.ok), g: !!(G.res.g && G.res.g.ok) }, pts });
  send({ t: 'rv', i: G.i, res: G.res, scores: G.scores, log: G.log, pts });
  showReveal(pts);
  setTimeout(hostNext, PAUSE[q.kind] || 3000);
}
function hostEnd() { if (G.ended) return; stopTimer(); send({ t: 'end', scores: G.scores, log: G.log }); battleResult(); }
function scoreBar() {
  return `<div class="score"><div class="p p1"><div class="n">${esc(G.names[G.me])}（你）</div><div class="s">${G.scores[G.me]}</div></div>
    <div class="vs">VS</div><div class="p p2"><div class="n">${esc(G.names[G.op])}</div><div class="s">${G.scores[G.op]}</div><div class="st" id="opst"></div></div></div>`;
}
let CTL = null, CTL2 = null;
function showBattleQ() {
  if (G.mode === 'local') return showSplit();
  const q = G.qs[G.i], T = KT[q.kind];
  app.innerHTML = `${scoreBar()}<div class="qcard"><div class="qhead"><span>第 ${G.i + 1} / ${G.qs.length} 題</span><span>⏱ <span class="tleft">${T}</span> 秒</span></div>
    <div class="timer"><i></i></div><div id="pnl"></div></div>
    <div class="center"><button class="btn sm" id="quit">${G.mode === 'host' ? '結束本局' : '離開'}</button></div>`;
  $('#quit').onclick = () => { if (G.mode === 'host') hostEnd(); else { send({ t: 'quit' }); location.hash = '#/'; } };
  CTL = panel($('#pnl'), q, { onDone: res => {
    if (G.mode === 'host') recordAnswer('h', res);
    else { send({ t: 'ans', i: G.i, res }); G.res[G.me] = res; }
  } });
  startTimer(T, () => { CTL.timeout(); if (G.mode === 'host') hostReveal(); });
}
function markOpp() { const s = $('#opst'); if (s) s.textContent = '✓ 已作答'; }
function showReveal(pts) {
  if (G.mode === 'local') return revealSplit(pts);
  if (!CTL) return;
  if (!CTL.done) { CTL.timeout(); }
  const sb = $('.score'); if (sb) sb.outerHTML = scoreBar();
  const mine = G.res[G.me], q = G.qs[G.i];
  if (!(mine && mine.ok) && q) Book.add(q, G.uid);
  const opOk = G.res[G.op] && G.res[G.op].ok;
  CTL.reveal(mine, `你 +${pts[G.me]}｜${esc(G.names[G.op])} ${opOk ? '✔' : '✘'} +${pts[G.op]}`);
  beep(!!(mine && mine.ok));
}
function battleResult() {
  stopTimer(); G.ended = true; closeSplit();
  const s = G.scores, local = G.mode === 'local', me = local ? 'h' : G.me, op = local ? 'g' : G.op;
  let title, win = s[me] > s[op];
  title = '對戰結束';
  const who = s.h === s.g ? '平手' : local ? (s.h > s.g ? '🔵 ' + esc(G.names.h) : '🟠 ' + esc(G.names.g)) + ' 獲勝' : win ? '你贏了' : esc(G.names[op]) + ' 獲勝';
  let gain = 0;
  if (!local) { gain = s[me] + (win ? 100 : 0); store.set('coins', coins() + gain); topbar(); }
  const mk = ok => ok ? '<span class="ok">✔</span>' : '<span class="bad">✘</span>';
  const rows = G.log.map(lg => `<li>${summary(G.qs[lg.i])}<div class="zz">${local ? esc(G.names.h) : '你'} ${mk(lg.ok[me])}　${local ? esc(G.names.g) : esc(G.names[op])} ${mk(lg.ok[op])}</div></li>`).join('');
  const hostSide = G.mode !== 'guest';
  app.innerHTML = `<div class="card frame result">
    <div class="vt">${title}</div>
    <p style="font-size:20px;margin:0">${who}</p>
    <div class="score" style="max-width:460px;margin:10px auto">
      <div class="p p1"><div class="n">${local ? '🔵 ' + esc(G.names.h) : esc(G.names[me]) + '（你）'}</div><div class="s">${s[me]}</div></div><div class="vs">VS</div>
      <div class="p p2"><div class="n">${local ? '🟠 ' + esc(G.names.g) : esc(G.names[op])}</div><div class="s">${s[op]}</div></div></div>
    ${gain ? `<p class="acc" style="margin:0">+${gain} XP${win ? '（含獲勝加成 100）' : ''}</p>` : ''}
    <h3 style="text-align:left;margin:16px 0 0">每題結果</h3><ol class="review">${rows}</ol>
    <div class="btnrow">${hostSide ? '<button class="btn gold" id="again">再比一局</button>' : '<p class="muted" style="margin:0">等房主開新的一局，或回首頁。</p>'}
      <a class="btn" href="#/book">錯題本</a><a class="btn" href="#/">回首頁</a></div></div>`;
  const ag = $('#again');
  if (ag) ag.onclick = () => { if (local) startLocal(G.uid, G.g); else if (conn && conn.open) hostStart(); else app.insertAdjacentHTML('afterbegin', '<div class="card">對手已離線。</div>'); };
}

/* ---------- 同一台平板：上下分割 ---------- */
function startLocal(uid, g) {
  closeNet();
  G = { mode: 'local', uid, g, names: { h: '藍方', g: '橘方' } };
  hostStart();
}
function closeSplit() { const sp = $('.split'); if (sp) sp.remove(); document.body.classList.remove('splitmode'); }
function showSplit() {
  const q = G.qs[G.i], T = KT[q.kind];
  closeSplit(); document.body.classList.add('splitmode');
  const sp = document.createElement('div'); sp.className = 'split';
  const half = who => `<div class="half ${who === 'g' ? 'flip' : ''}" data-who="${who}"><div class="lbl">${who === 'h' ? '🔵' : '🟠'} ${esc(G.names[who])}　<b>${G.scores[who]}</b> 分　<span class="lst"></span></div><div class="hp"></div></div>`;
  sp.innerHTML = `${half('g')}<div class="mid"><span>${G.i + 1}/${G.qs.length}</span><div class="timer" style="flex:1;margin:0"><i></i></div><span><span class="tleft">${T}</span>s</span><button class="btn sm" id="squit">結束</button></div>${half('h')}`;
  document.body.appendChild(sp);
  sp.querySelector('#squit').onclick = hostEnd;
  CTL = panel(sp.querySelector('[data-who="h"] .hp'), q, { compact: true, onDone: res => recordAnswer('h', res) });
  CTL2 = panel(sp.querySelector('[data-who="g"] .hp'), q, { compact: true, mute: true, onDone: res => recordAnswer('g', res) });
  startTimer(T, () => { CTL.timeout(); CTL2.timeout(); hostReveal(); });
}
function revealSplit(pts) {
  [['h', CTL], ['g', CTL2]].forEach(([w, c]) => {
    if (!c) return; if (!c.done) c.timeout();
    c.reveal(G.res[w], `+${pts[w]}`);
    const lb = document.querySelector(`.half[data-who="${w}"] .lbl b`); if (lb) lb.textContent = G.scores[w];
    const st = document.querySelector(`.half[data-who="${w}"] .lst`); if (st) st.innerHTML = pts[w] ? `<b class="ok">+${pts[w]}</b>` : '<b class="bad">✘</b>';
  });
}

/* ---------- 錯題本畫面 ---------- */
const BOOK_TABS = [['all', '全部'], ['L1', 'L1'], ['L2', 'L2'], ['L3', 'L3'], ['L4', 'L4'], ['L5', 'L5'], ['L6', 'L6'], ['R', 'Review 句子重組'], ['VERB', '三態'], ['POLY', '一字多義']];
function bookFilter(f) {
  const items = Object.values(Book.all()).sort((a, b) => b.t - a.t);
  if (!f || f === 'all') return items;
  if (f === 'R') return items.filter(e => /^R\d/.test(e.where));
  return items.filter(e => e.where === f);
}
function bookView(f) {
  stopTimer(); closeNet();
  f = f || 'all';
  const items = bookFilter(f), allN = Book.count();
  const byGame = {}; items.forEach(e => { byGame[e.g] = (byGame[e.g] || 0) + 1; });
  app.innerHTML = `<div class="crumb"><a href="#/">← 回首頁</a></div>
  <div class="card frame">
    <div style="display:flex;align-items:center;gap:12px"><div style="font-size:44px">📕</div>
      <div><h2 style="margin:0;font-size:28px;line-height:1.2">錯題本</h2>
      <div class="muted" style="font-size:14px">答錯的題目會自動加進來（共 ${allN} 題）。在「錯題練習」中答對，就會從錯題本移除。</div></div></div>
  </div>
  <div class="seg2">${BOOK_TABS.map(([k, n]) => { const c = bookFilter(k).length; return `<button class="${k === f ? 'on' : ''}" data-f="${k}">${n}${c ? ` (${c})` : ''}</button>`; }).join('')}</div>
  ${items.length ? `<div class="card center stack">
      <div class="muted" style="font-size:14px">${Object.entries(byGame).map(([g, n]) => `${GAMES[g].ic} ${GAMES[g].name} ${n}`).join('　')}</div>
      <button class="btn gold" id="bp" style="font-size:18px">開始錯題練習（${Math.min(items.length, 20)} 題）</button>
      <span class="muted" style="font-size:12px">每次最多 20 題，最常錯、最近錯的優先</span></div>
    <ol class="review booklist">${items.map(e => `<li data-id="${esc(e.id)}"><div class="bk-h"><span class="chip">${e.where === 'VERB' ? '三態' : e.where === 'POLY' ? '一字多義' : esc(e.where)}・${GAMES[e.g].name}</span><span class="chip red">錯 ${e.n} 次</span><button class="btn sm del">✔ 已掌握</button></div>${summary(e.q)}</li>`).join('')}</ol>
    <div class="center"><button class="btn sm" id="clr">清空${f === 'all' ? '全部' : '此分類'}錯題</button></div>`
  : `<div class="card center"><p style="font-size:18px">目前沒有錯題</p><p class="muted">練習時答錯的題目會自動出現在這裡。</p><a class="btn gold" href="#/">回首頁</a></div>`}`;
  app.querySelectorAll('.seg2 button').forEach(b => b.onclick = () => { location.hash = '#/book/' + b.dataset.f; });
  app.querySelectorAll('.booklist .del').forEach(b => b.onclick = () => { Book.remove(b.closest('li').dataset.id); bookView(f); });
  const bp = $('#bp'); if (bp) bp.onclick = () => bookPlay(f);
  const cl = $('#clr'); if (cl) cl.onclick = () => { if (!confirm('確定要清空這些錯題嗎？')) return; const b = Book.all(); items.forEach(e => delete b[e.id]); Book.save(b); bookView(f); };
}
function bookPlay(f) {
  const items = bookFilter(f).sort((a, b) => b.n - a.n || b.t - a.t).slice(0, 20);
  solo('BOOK', 'book', shuffle(items.map(e => e.q)));
  G.filter = f;
}
