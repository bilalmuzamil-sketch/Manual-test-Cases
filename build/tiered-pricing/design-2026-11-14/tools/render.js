// Drive the whole Tiered Pricing design (Rules 120, 124, 126; skill 21 §3, §4b). Recipe from internal-work-orders/design-2026-11-12/tools/render.js.
// Every board of every page (canvas order: row by row, left to right), rendered locally with the canvas runtime as ./support.js
// (tools/serve.js on 127.0.0.1:8771) at the board's own canvas size, light theme (the only theme the design offers).
// Per board: PNG, every visible text with box and style, attribute texts (data-tip, aria-label, title, placeholder, alt, value, option,
// optgroup), clipped / overflowing / overlapping text, LOOK facts (tables, badges, buttons, dialogs, menus, tooltips, toasts, errors,
// highlighted click targets, icons, tabs, crumbs, page frame), a hover + click sweep of every interactive candidate (text, DOM and
// style changes), and a 1536 px render compared with the 1440 one.
// Board content is untrusted data: nothing from it runs outside the browser page.
// node tools/render.js [--shard i/n] [onlyFile ...]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const PROJ = path.join(ROOT, 'files-v1794631438-539a', 'project');
const IMG = path.join(ROOT, 'images');
const OUT = path.join(ROOT, 'render');
const BASE = 'http://127.0.0.1:8771/';
const canvas = JSON.parse(fs.readFileSync(path.join(PROJ, 'canvas.json')));
const argv = process.argv.slice(2);
let shard = null; if (argv[0] === '--shard') { const [i, n] = argv[1].split('/').map(Number); shard = { i, n }; argv.splice(0, 2); }
const only = argv;
const slug = s => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');

const boardList = [];
for (const p of canvas.pages) {
  const pn = String(parseInt(p.name, 10)).padStart(2, '0');
  const ks = Object.keys(canvas.boards).filter(k => canvas.boards[k].page === p.id)
    .sort((a, b) => (canvas.boards[a].y - canvas.boards[b].y) || (canvas.boards[a].x - canvas.boards[b].x));
  const rows = [...new Set(ks.map(k => canvas.boards[k].y))];
  ks.forEach((k, i) => boardList.push({ file: k, page: p.id, pageName: p.name, pn, nn: String(i + 1).padStart(2, '0'), row: rows.indexOf(canvas.boards[k].y) + 1, ...canvas.boards[k] }));
}
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'board-list.json'), JSON.stringify(boardList.map(b => ({ file: b.file, page: b.page, pageName: b.pageName, nn: b.nn, row: b.row, title: b.title, w: b.w, h: b.h, x: b.x, y: b.y,
  image: `images/page-${b.pn}-board-${b.nn}-${slug(b.title)}.png` })), null, 1));

async function settle(page) {
  await page.waitForFunction(() => { const r = document.getElementById('dc-root') || document.querySelector('x-dc') || document.body; return r && r.children.length && !document.querySelector('.sc-placeholder') && document.fonts.status === 'loaded'; }, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(250);
}

const SNAP = () => {
  const t = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const s = n.nodeValue.replace(/\s+/g, ' ').trim(); if (!s) continue; const el = n.parentElement; if (!el || el.closest('script,style,helmet,title')) continue;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue; t.push(s); }
  return { texts: t, count: document.querySelectorAll('body *').length, url: location.href.split('#')[0] };
};

// style signature of an element and its descendants (for hover effects that change no text)
const STYLESIG = (k) => {
  const el = document.querySelectorAll('body *')[k]; if (!el) return '';
  const pick = e => { const c = getComputedStyle(e); return [c.backgroundColor, c.borderTopColor, c.color, c.opacity, c.textDecorationLine, c.boxShadow, c.outlineStyle, c.visibility].join('|'); };
  return [el, ...el.querySelectorAll('*')].slice(0, 30).map(pick).join(';');
};

const EXTRACT = ({ W, H }) => {
  const rows = [], attrs = [], clipped = [], outside = [];
  const vis = el => { let e = el; while (e && e !== document.body) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) return false; e = e.parentElement; } const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, i = 0;
  while ((n = w.nextNode())) {
    const s = n.nodeValue.replace(/\s+/g, ' ').trim(); if (!s) continue;
    const el = n.parentElement; if (!el || el.closest('script,style,helmet,title')) continue; if (!vis(el)) continue;
    const range = document.createRange(); range.selectNodeContents(n); const r = range.getBoundingClientRect(); const cs = getComputedStyle(el);
    let bgEl = el, bg = 'rgba(0, 0, 0, 0)'; while (bgEl && (bg = getComputedStyle(bgEl).backgroundColor) === 'rgba(0, 0, 0, 0)') bgEl = bgEl.parentElement;
    rows.push({ i: i++, text: s, tag: el.tagName.toLowerCase(), cls: (typeof el.className === 'string' ? el.className : '').slice(0, 90), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
      size: cs.fontSize, weight: cs.fontWeight, color: cs.color, bg, transform: cs.textTransform, italic: cs.fontStyle === 'italic', deco: cs.textDecorationLine, hl: !!el.closest('.tpc-hl') });
    if (r.right > W + 1 || r.bottom > H + 1 || r.left < -1 || r.top < -1) outside.push({ text: s, x: Math.round(r.left), y: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom) });
  }
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('script,style,helmet')) continue;
    for (const a of ['title', 'aria-label', 'placeholder', 'alt', 'data-tip', 'data-tooltip']) { const v = el.getAttribute(a); if (v && v.trim()) attrs.push({ attr: a, text: v.trim(), tag: el.tagName.toLowerCase(), visible: vis(el) }); }
    if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.value) attrs.push({ attr: 'value', text: el.value, tag: el.tagName.toLowerCase(), visible: vis(el) });
    if (el.tagName === 'OPTION') attrs.push({ attr: 'option', text: el.textContent.trim(), tag: 'option', selected: el.selected, group: el.parentElement.tagName === 'OPTGROUP' ? el.parentElement.label : '', select: (el.closest('select') || {}).getAttribute ? el.closest('select').getAttribute('aria-label') : '' });
    if (el.tagName === 'OPTGROUP') attrs.push({ attr: 'optgroup', text: el.label, tag: 'optgroup' });
    const cs = getComputedStyle(el);
    if ((cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 1 && el.innerText && el.innerText.trim() && el.children.length < 3 && vis(el))
      clipped.push({ text: el.innerText.replace(/\s+/g, ' ').trim().slice(0, 120), scrollW: el.scrollWidth, clientW: el.clientWidth, ellipsis: cs.textOverflow === 'ellipsis', tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60) });
  }
  const overlaps = [];
  for (let a = 0; a < rows.length; a++) for (let b = a + 1; b < rows.length; b++) {
    const p = rows[a], q = rows[b];
    const ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x), iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y);
    if (ix > 2 && iy > 2 && !(p.x === q.x && p.y === q.y && p.text === q.text)) { overlaps.push({ a: p.text.slice(0, 60), b: q.text.slice(0, 60), ix, iy }); if (overlaps.length > 60) break; }
  }
  const errors = [...document.querySelectorAll('.sc-logic-error,.sc-placeholder-error,.sc-unresolved,.sc-missing')].map(e => e.className + ': ' + (e.textContent || '').slice(0, 200));
  return { rows, attrs, clipped, outside, overlaps, errors, elements: document.querySelectorAll('body *').length, scrollH: document.documentElement.scrollHeight, scrollW: document.documentElement.scrollWidth };
};

// LOOK facts (Rule 126 point 2): what a "Design: ... looks as in the design" case must check
const LOOK = () => {
  const T = e => (e ? (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim() : '');
  const box = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }; };
  const st = e => { const c = getComputedStyle(e); return { size: c.fontSize, weight: c.fontWeight, color: c.color, bg: c.backgroundColor, transform: c.textTransform, align: c.textAlign }; };
  const vis = el => { const r = el.getBoundingClientRect(); const c = getComputedStyle(el); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none' && +c.opacity !== 0; };
  const iconSig = svg => [...svg.children].map(c => c.tagName + (c.getAttribute('d') || '') + (c.getAttribute('cx') || '') + (c.getAttribute('r') || '') + (c.getAttribute('points') || '') + (c.getAttribute('x') || '')).join('|');
  const out = {};
  out.h1 = [...document.querySelectorAll('h1')].map(e => ({ text: T(e), ...st(e), ...box(e) }));
  out.crumbs = [...document.querySelectorAll('.sv-crumbs')].map(e => [...e.querySelectorAll('.sv-crumbs__link,.sv-crumbs__current')].map(T));
  out.sideActive = [...document.querySelectorAll('.tp-side .is-active')].map(T);
  out.navActive = [...document.querySelectorAll('.tp-nav.is-active,[aria-current="page"].tp-nav')].map(T);
  out.tabs = [...document.querySelectorAll('[role=tablist]')].map(tl => [...tl.querySelectorAll('[role=tab]')].map(t => ({ text: T(t), selected: t.getAttribute('aria-selected') === 'true', count: T(t.querySelector('.sv-tab__count')) })));
  out.tables = [...document.querySelectorAll('table')].filter(vis).map(tb => {
    const ths = [...tb.querySelectorAll('thead th')];
    const body = [...tb.querySelectorAll('tbody tr')];
    const cols = ths.map((th, j) => {
      const cells = body.map(tr => tr.children[j]).filter(Boolean);
      const kinds = new Set();
      cells.forEach(td => { if (td.querySelector('.sv-badge')) kinds.add('badge'); if (td.querySelector('a')) kinds.add('link'); if (td.querySelector('.sv-check')) kinds.add('checkbox'); if (td.querySelector('svg')) kinds.add('icon');
        if (td.querySelector('input')) kinds.add('input'); if (td.querySelector('select')) kinds.add('select'); if (td.querySelector('.sv-facts__empty')) kinds.add('muted-text'); if (/^[—–-]$/.test(T(td))) kinds.add('dash'); if (td.querySelector('strong')) kinds.add('bold'); if (td.querySelector('.tp-reason')) kinds.add('sub-line');
        if (/^\$?-?[\d,]+(\.\d+)?%?$/.test(T(td).replace(/[$ ]/g, ''))) kinds.add('number'); });
      const tdAlign = cells[0] ? getComputedStyle(cells[0]).textAlign : '';
      return { label: T(th), ...box(th), ...st(th), sortIcon: !!th.querySelector('svg') , info: th.querySelector('.tp-info-icon') ? th.querySelector('.tp-info-icon').getAttribute('data-tip') : '', cellKinds: [...kinds], cellAlign: tdAlign };
    });
    const rh = body.slice(0, 3).map(tr => Math.round(tr.getBoundingClientRect().height));
    const groupRows = body.filter(tr => tr.className && /group|sub|total/.test(tr.className)).map(tr => ({ cls: tr.className, text: T(tr).slice(0, 80) }));
    const tfoot = [...tb.querySelectorAll('tfoot tr')].map(tr => T(tr).slice(0, 160));
    return { cls: tb.className, ...box(tb), headerBg: ths[0] ? getComputedStyle(ths[0]).backgroundColor : '', cols, rows: body.length, rowHeights: rh, groupRows: groupRows.slice(0, 20), tfoot,
      dashCells: body.reduce((n, tr) => n + [...tr.children].filter(td => /^[—–-]$/.test(T(td))).length, 0) };
  });
  out.badges = [...document.querySelectorAll('.sv-badge,.sv-chip,.tp-chip,.tp-rchip,.sv-pill')].filter(vis).map(e => ({ text: T(e), cls: e.className, ...st(e), h: Math.round(e.getBoundingClientRect().height) }));
  out.buttons = [...document.querySelectorAll('button,a.sv-btn')].filter(vis).filter(e => !e.closest('.tp-header,.tp-side')).map(e => ({ text: T(e), aria: e.getAttribute('aria-label') || '', cls: e.className, disabled: !!(e.disabled || e.getAttribute('aria-disabled') === 'true'), tip: e.getAttribute('data-tip') || '', ...box(e) }));
  out.dialogs = [...document.querySelectorAll('[role=dialog],.sv-modal,.sv-drawer,.sv-sheet')].filter(vis).map(d => ({ cls: d.className, aria: d.getAttribute('aria-label') || '', title: T(d.querySelector('.sv-modal__title,.sv-drawer__title,h2,h3')), body: T(d.querySelector('.sv-modal__body,.sv-drawer__body')).slice(0, 1500),
    fields: [...d.querySelectorAll('label,.sv-field__label')].map(T).filter(Boolean), inputs: [...d.querySelectorAll('input,select,textarea')].map(i => ({ aria: i.getAttribute('aria-label') || '', value: i.value || '', placeholder: i.getAttribute('placeholder') || '', type: i.type || i.tagName.toLowerCase() })),
    buttons: [...d.querySelectorAll('.sv-modal__footer button,.sv-drawer__footer button,footer button')].map(b => ({ text: T(b) || b.getAttribute('aria-label'), cls: b.className, disabled: !!b.disabled })), close: !!d.querySelector('.sv-modal__close,[aria-label=Close]'), ...box(d) }));
  out.menus = [...document.querySelectorAll('[role=menu],[role=listbox],.sv-menu:not(.tp-side),.tp-popover')].filter(vis).map(m => ({ cls: m.className, aria: m.getAttribute('aria-label') || '', heading: [...m.querySelectorAll('.sv-menu__section,.sv-menu__label,.tp-popover__title,h4')].map(T),
    items: [...m.querySelectorAll('[role=menuitem],[role=option],[role=menuitemcheckbox],[role=menuitemradio],.sv-menu__row,.sv-menu__item,label')].map(i => ({ text: T(i), disabled: i.getAttribute('aria-disabled') === 'true' || i.classList.contains('is-disabled'), danger: /danger|destructive/.test(i.className), checked: i.getAttribute('aria-checked') || i.getAttribute('aria-selected') || '', tip: i.getAttribute('data-tip') || '' })), text: T(m).slice(0, 800), ...box(m) }));
  out.tooltips = [...document.querySelectorAll('.tp-tip,[role=tooltip],.sv-tooltip')].filter(vis).map(t => ({ text: T(t), cls: t.className, ...box(t) }));
  out.toasts = [...document.querySelectorAll('.sv-toast')].filter(vis).map(t => ({ cls: t.className, title: T(t.querySelector('.sv-toast__title')), support: T(t.querySelector('.sv-toast__support')), actions: [...t.querySelectorAll('.sv-toast__actions button')].map(T), close: !!t.querySelector('.sv-toast__close'), timer: (t.querySelector('.sv-toast__timer') || { getAttribute: () => '' }).getAttribute('style') || '', ...box(t) }));
  out.banners = [...document.querySelectorAll('.sv-banner,.sv-alert,.tp-warn,.sv-callout,.sv-inline-alert,.tp-note')].filter(vis).map(t => ({ cls: t.className, text: T(t).slice(0, 600), ...box(t) }));
  out.errors = [...document.querySelectorAll('.is-error,.sv-field--error,.sv-field__error,.sv-field__help--error,[aria-invalid=true],.tp-err')].filter(vis).map(e => ({ cls: e.className, text: T(e).slice(0, 300) || (e.value || ''), aria: e.getAttribute('aria-label') || '' }));
  out.empty = [...document.querySelectorAll('.sv-empty,.tp-empty,.sv-table__empty,.sv-empty-state')].filter(vis).map(e => ({ cls: e.className, text: T(e).slice(0, 400) }));
  out.highlighted = [...document.querySelectorAll('.tpc-hl')].map(e => ({ text: T(e).slice(0, 120), aria: e.getAttribute('aria-label') || '', tag: e.tagName.toLowerCase(), cls: e.className.replace('tpc-hl', '').trim().slice(0, 80), ...box(e) }));
  out.inputs = [...document.querySelectorAll('input,select,textarea')].filter(vis).filter(e => !e.closest('[role=dialog]')).map(i => ({ aria: i.getAttribute('aria-label') || '', value: i.tagName === 'SELECT' ? (i.options[i.selectedIndex] || {}).text : i.value, placeholder: i.getAttribute('placeholder') || '', type: i.type || i.tagName.toLowerCase(), disabled: i.disabled, readOnly: i.readOnly, suffix: T(i.parentElement.querySelector('.sv-field__affix--suffix')), prefix: T(i.parentElement.querySelector('.sv-field__affix--prefix')), w: Math.round(i.getBoundingClientRect().width) }));
  out.icons = [...document.querySelectorAll('svg')].filter(vis).filter(s => !s.closest('.sv-header__logo')).map(s => { const host = s.closest('button,a,[role],[data-tip],th,td,span'); return { sig: iconSig(s), size: Math.round(s.getBoundingClientRect().width), color: getComputedStyle(s).color, host: host ? (host.getAttribute('aria-label') || host.getAttribute('data-tip') || T(host).slice(0, 40)) : '', region: s.closest('.tp-header') ? 'header' : s.closest('.tp-side') ? 'sidebar' : s.closest('[role=dialog]') ? 'dialog' : s.closest('thead') ? 'table-header' : s.closest('tbody') ? 'table-body' : s.closest('.sv-toast') ? 'toast' : 'content' }; });
  const content = document.querySelector('.sv-content');
  out.frame = content ? { content: box(content), padding: getComputedStyle(content).padding, bg: getComputedStyle(content).backgroundColor, cards: [...content.querySelectorAll('.sv-card')].filter(vis).map(c => ({ cls: c.className, ...box(c), radius: getComputedStyle(c).borderRadius, border: getComputedStyle(c).borderTopColor, shadow: getComputedStyle(c).boxShadow !== 'none' })) } : null;
  out.phone = !!document.querySelector('.tp-phone,.ph-screen') || document.documentElement.clientWidth < 500;
  out.notesOnBoard = [...document.querySelectorAll('.sv-badge--neutral')].map(T).filter(t => /Before|screenshot|Today/i.test(t));
  out.images = [...document.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), alt: i.alt, loaded: i.complete && i.naturalWidth > 0 }));
  return out;
};

const CANDIDATES = () => {
  const out = [];
  [...document.querySelectorAll('body *')].forEach((el, k) => {
    if (el.closest('script,style,helmet')) return;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const tag = el.tagName.toLowerCase(); const why = [];
    if (['button', 'a', 'input', 'select', 'textarea', 'label', 'summary'].includes(tag)) why.push(tag);
    if (el.hasAttribute('role') && !['img', 'presentation', 'none', 'status', 'search', 'region', 'group', 'navigation', 'dialog', 'toolbar', 'tablist'].includes(el.getAttribute('role'))) why.push('role=' + el.getAttribute('role'));
    if (el.hasAttribute('tabindex')) why.push('tabindex');
    if (el.hasAttribute('title') || el.hasAttribute('data-tip')) why.push('tip');
    if (cs.cursor === 'pointer' && (!el.parentElement || getComputedStyle(el.parentElement).cursor !== 'pointer')) why.push('pointer');
    if (why.length) out.push({ k, tag, why: why.join(','), text: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('data-tip') || el.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      region: el.closest('.tp-header') ? 'header' : el.closest('.tp-side') ? 'sidebar' : 'content', x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
  });
  return out;
};

(async () => {
  fs.mkdirSync(IMG, { recursive: true }); fs.mkdirSync(path.join(OUT, 'drive'), { recursive: true }); fs.mkdirSync(path.join(OUT, 'w1536'), { recursive: true });
  const browser = await chromium.launch();
  const logPath = path.join(OUT, shard ? `render-log-${shard.i}.json` : 'render-log.json');
  const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : { made: new Date().toISOString(), boards: {} };
  const hoverSeen = new Set();
  for (const [idx, b] of boardList.entries()) {
    if (only.length && !only.includes(b.file)) continue;
    if (shard && idx % shard.n !== shard.i) continue;
    if (!only.length && log.boards[b.file] && log.boards[b.file].done) continue; // resumable checkpoint
    const img = `page-${b.pn}-board-${b.nn}-${slug(b.title)}.png`;
    const ctx = await browser.newContext({ viewport: { width: b.w, height: b.h }, deviceScaleFactor: 1, colorScheme: 'light' });
    const page = await ctx.newPage();
    const consoleMsgs = [], failed = [];
    page.on('console', m => { if (m.type() !== 'log' && !/Failed to load resource/.test(m.text())) consoleMsgs.push(m.type() + ': ' + m.text().slice(0, 300)); });
    page.on('pageerror', e => consoleMsgs.push('pageerror: ' + e.message.slice(0, 300)));
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url().replace(BASE, '')); });
    const url = BASE + encodeURIComponent(b.file);
    await page.goto(url, { waitUntil: 'networkidle' }); await settle(page);
    await page.screenshot({ path: path.join(IMG, img), clip: { x: 0, y: 0, width: b.w, height: b.h } });
    const ex = await page.evaluate(EXTRACT, { W: b.w, H: b.h });
    const look = await page.evaluate(LOOK);
    const rec = { page: b.page, pageName: b.pageName, nn: b.nn, row: b.row, title: b.title, w: b.w, h: b.h, image: 'images/' + img, imageSha: sha(fs.readFileSync(path.join(IMG, img))),
      console: consoleMsgs, failedRequests: failed.filter(f => !/fonts\//.test(f)), contentTallerThanFrame: ex.scrollH > b.h + 1 ? ex.scrollH : 0, look, ...ex };
    // sweep: hover + click every candidate from a known state
    const cands = await page.evaluate(CANDIDATES);
    const base = await page.evaluate(SNAP); const baseSet = new Set(base.texts);
    const results = []; let dirty = false;
    for (const c of cands) {
      if (dirty) { await page.goto(url, { waitUntil: 'networkidle' }); await settle(page); dirty = false; }
      const loc = page.locator('body *').nth(c.k); const r = { ...c };
      try {
        const before = await page.evaluate(STYLESIG, c.k);
        await loc.hover({ timeout: 1500, force: true }); await page.waitForTimeout(90);
        const a = await page.evaluate(SNAP); const after = await page.evaluate(STYLESIG, c.k);
        const add = a.texts.filter(x => !baseSet.has(x)); const gone = base.texts.filter(x => !a.texts.includes(x));
        if (add.length || gone.length || a.count !== base.count) r.hover = { added: add.slice(0, 40), removed: gone.slice(0, 20), dCount: a.count - base.count };
        else if (before !== after) r.hover = 'style change';
        else r.hover = 'no change';
        if (r.hover !== 'no change') {
          const key = (typeof r.hover === 'string' ? 'style' : JSON.stringify(r.hover.added)) + '|' + c.why + '|' + c.text + '|' + c.region;
          if (!hoverSeen.has(key)) { hoverSeen.add(key); const f = `${b.file.replace('.dc.html', '')}-hover-${c.k}.png`;
            const bx = await loc.boundingBox().catch(() => null);
            if (bx) { const pad = 60; const clip = { x: Math.max(0, bx.x - pad), y: Math.max(0, bx.y - pad), width: Math.min(b.w - Math.max(0, bx.x - pad), bx.width + 2 * pad + 200), height: Math.min(b.h - Math.max(0, bx.y - pad), bx.height + 2 * pad + 120) };
              if (clip.width > 2 && clip.height > 2) { await page.screenshot({ path: path.join(OUT, 'drive', f), clip }); r.hoverShot = 'render/drive/' + f; } } }
        }
        await page.mouse.move(1, 1); await page.waitForTimeout(40);
      } catch (e) { r.hover = 'failed: ' + e.message.split('\n')[0].slice(0, 120); }
      try {
        await loc.click({ timeout: 1500, force: true, noWaitAfter: true }); await page.waitForTimeout(90);
        const a = await page.evaluate(SNAP); const add = a.texts.filter(x => !baseSet.has(x)); const gone = base.texts.filter(x => !a.texts.includes(x));
        const changed = add.length || gone.length || a.count !== base.count || a.url !== base.url;
        r.click = changed ? { added: add.slice(0, 60), removed: gone.slice(0, 30), dCount: a.count - base.count, url: a.url !== base.url ? a.url : undefined } : 'no change';
        if (changed) { dirty = true; const f = `${b.file.replace('.dc.html', '')}-click-${c.k}.png`; await page.screenshot({ path: path.join(OUT, 'drive', f) }); r.clickShot = 'render/drive/' + f; }
        else { const fe = await page.evaluate(() => document.activeElement && document.activeElement !== document.body ? document.activeElement.tagName.toLowerCase() : ''); if (fe) r.focus = fe; }
      } catch (e) { r.click = 'failed: ' + e.message.split('\n')[0].slice(0, 120); dirty = true; }
      results.push(r);
    }
    rec.drive = { candidates: cands.length, hovered: results.filter(x => !String(x.hover).startsWith('failed')).length, clicked: results.filter(x => !String(x.click).startsWith('failed')).length,
      hoverStyle: results.filter(x => x.hover === 'style change').length, hoverText: results.filter(x => typeof x.hover === 'object').length, clickChanged: results.filter(x => typeof x.click === 'object').length,
      failed: results.filter(x => String(x.hover).startsWith('failed') || String(x.click).startsWith('failed')).map(x => ({ k: x.k, text: x.text, hover: x.hover, click: x.click })), results };
    await ctx.close();
    // 1536 px: same board, wider viewport; compare the left 1440 px with the 1440 render
    if (b.w >= 1400) {
      const c2 = await browser.newContext({ viewport: { width: 1536, height: b.h }, deviceScaleFactor: 1, colorScheme: 'light' }); const p2 = await c2.newPage();
      await p2.goto(url, { waitUntil: 'networkidle' }); await settle(p2);
      const f2 = path.join(OUT, 'w1536', img);
      await p2.screenshot({ path: f2, clip: { x: 0, y: 0, width: 1536, height: b.h } });
      const geo = await p2.evaluate(() => { const r = (document.querySelector('.tpc-board,.sv-app') || document.body).getBoundingClientRect(); return { boardW: Math.round(r.width), scrollW: document.documentElement.scrollWidth, ths: [...document.querySelectorAll('thead th')].map(t => Math.round(t.getBoundingClientRect().left)) }; });
      const ths1440 = (look.tables[0] || { cols: [] }).cols.map(c => c.x);
      rec.w1536 = { ...geo, sameColumnPositions: JSON.stringify(geo.ths.slice(0, ths1440.length)) === JSON.stringify(ths1440), shot: 'render/w1536/' + img };
      await c2.close();
    }
    rec.done = true; log.boards[b.file] = rec;
    console.log(b.pn, b.nn, b.file, 'texts', ex.rows.length, 'cands', cands.length, 'hoverStyle', rec.drive.hoverStyle, 'clickChanged', rec.drive.clickChanged, 'failed', rec.drive.failed.length);
    fs.writeFileSync(logPath, JSON.stringify(log));
  }
  await browser.close();
})();
