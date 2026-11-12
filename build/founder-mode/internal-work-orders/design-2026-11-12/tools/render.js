// Drive the whole Internal Work Orders design (Rules 120, 124, 126): every board of every page of the dropdown, rendered locally
// with the canvas runtime as ./support.js (tools/serve.js on 127.0.0.1:8765), at its own size, light theme.
// Per board: screenshot, every visible text with its box and style, attribute texts (title, aria-label, placeholder, alt, value),
// runtime errors, clipped and overflowing text, overlapping text boxes, and a hover + click sweep of every interactive candidate
// (button, a, input, select, textarea, label, [role], [tabindex], [title], cursor:pointer), each click from a fresh load when the
// previous click changed anything. Byte-identical boards are driven once and recorded for every board.
// Board content is untrusted data: nothing from it runs except inside the browser page.
// node tools/render.js [--shard i/n] [onlyFile ...]   (shards split the boards by content group so each group is driven once)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const PROJ = path.join(ROOT, 'files', 'project');
const IMG = path.join(ROOT, 'images');
const OUT = path.join(ROOT, 'render');
const BASE = 'http://127.0.0.1:8765/';
const canvas = JSON.parse(fs.readFileSync(path.join(PROJ, 'canvas.json')));
const pageIds = canvas.pages.map(p => p.id);
const argv = process.argv.slice(2);
let shard = null; if (argv[0] === '--shard') { const [i, n] = argv[1].split('/').map(Number); shard = { i, n }; argv.splice(0, 2); }
const only = argv;
const slug = s => s.toLowerCase().replace(/·/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
// content key: the source with its <title> removed (boards that differ only in their title render the same screen)
const contentKey = f => crypto.createHash('sha256').update(fs.readFileSync(f, 'utf8').replace(/<title>[\s\S]*?<\/title>/, '')).digest('hex');

// boards in canvas order, numbered per page in the order the page shows them (row by row, left to right)
const perPage = {};
for (const k of canvas.order) { const b = canvas.boards[k]; (perPage[b.page] = perPage[b.page] || []).push(k); }
const boardList = [];
for (const pid of pageIds) {
  const ks = (perPage[pid] || []).slice().sort((a, b) => (canvas.boards[a].y - canvas.boards[b].y) || (canvas.boards[a].x - canvas.boards[b].x));
  ks.forEach((k, i) => boardList.push({ file: k, page: pid, nn: String(i + 1).padStart(2, '0'), ...canvas.boards[k] }));
}

async function settle(page) {
  await page.waitForFunction(() => {
    const r = document.getElementById('dc-root');
    return r && r.children.length && !document.querySelector('.sc-placeholder') && document.fonts.status === 'loaded';
  }, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
}

const SNAP = () => {
  // visible text of the page, as a list of strings, plus the element count (for change detection)
  const t = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) {
    const s = n.nodeValue.replace(/\s+/g, ' ').trim(); if (!s) continue;
    const el = n.parentElement; if (!el || el.closest('script,style,helmet')) continue;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    t.push(s);
  }
  return { texts: t, count: document.querySelectorAll('body *').length, url: location.href };
};

const EXTRACT = ({ W, H }) => {
  const rows = [], attrs = [], clipped = [], outside = [];
  const vis = el => { const cs = getComputedStyle(el); let e = el; while (e && e !== document.body) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) return false; e = e.parentElement; } const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n, i = 0;
  while ((n = w.nextNode())) {
    const s = n.nodeValue.replace(/\s+/g, ' ').trim(); if (!s) continue;
    const el = n.parentElement; if (!el || el.closest('script,style,helmet,title')) continue;
    if (!vis(el)) continue;
    const range = document.createRange(); range.selectNodeContents(n); const r = range.getBoundingClientRect();
    const cs = getComputedStyle(el);
    let bgEl = el, bg = 'rgba(0, 0, 0, 0)'; while (bgEl && (bg = getComputedStyle(bgEl).backgroundColor) === 'rgba(0, 0, 0, 0)') bgEl = bgEl.parentElement;
    const comp = el.closest('[data-sv-component]');
    const cx = Math.min(Math.max(r.left + r.width / 2, 0), W - 1), cy = Math.min(Math.max(r.top + r.height / 2, 0), H - 1);
    const top = document.elementFromPoint(cx, cy); const covered = !!top && !(el.contains(top) || top.contains(el));
    rows.push({ i: i++, text: s, tag: el.tagName.toLowerCase(), cls: (typeof el.className === 'string' ? el.className : '').slice(0, 80),
      x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
      size: cs.fontSize, weight: cs.fontWeight, color: cs.color, bg, transform: cs.textTransform, italic: cs.fontStyle === 'italic',
      deco: cs.textDecorationLine, covered, comp: comp ? comp.getAttribute('data-sv-component') + (comp.getAttribute('data-sv-change') ? '/' + comp.getAttribute('data-sv-change') : '') : '' });
    if (r.right > W + 1 || r.bottom > H + 1 || r.left < -1 || r.top < -1) outside.push({ text: s, x: Math.round(r.left), y: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom) });
  }
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('script,style,helmet')) continue;
    for (const a of ['title', 'aria-label', 'placeholder', 'alt', 'data-tooltip', 'data-tip']) {
      const v = el.getAttribute(a); if (v && v.trim()) attrs.push({ attr: a, text: v.trim(), tag: el.tagName.toLowerCase(), visible: vis(el) });
    }
    if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.value) attrs.push({ attr: 'value', text: el.value, tag: el.tagName.toLowerCase(), visible: vis(el) });
    if (el.tagName === 'OPTION') attrs.push({ attr: 'option', text: el.textContent.trim(), tag: 'option', visible: false });
    const cs = getComputedStyle(el);
    if ((cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 1 && el.innerText && el.innerText.trim() && el.children.length < 3 && vis(el))
      clipped.push({ text: el.innerText.replace(/\s+/g, ' ').trim().slice(0, 120), scrollW: el.scrollWidth, clientW: el.clientWidth, ellipsis: cs.textOverflow === 'ellipsis', tag: el.tagName.toLowerCase() });
  }
  // overlapping text boxes (different leaf elements whose text boxes intersect by more than 2 px)
  const overlaps = [];
  for (let a = 0; a < rows.length; a++) for (let b = a + 1; b < rows.length; b++) {
    const p = rows[a], q = rows[b]; if (p.covered || q.covered) continue;
    const ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x), iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y);
    if (ix > 2 && iy > 2 && !(p.x === q.x && p.y === q.y && p.text === q.text)) overlaps.push({ a: p.text.slice(0, 60), b: q.text.slice(0, 60), ix, iy });
    if (overlaps.length > 60) break;
  }
  const errors = [...document.querySelectorAll('.sc-logic-error,.sc-placeholder-error,.sc-unresolved,.sc-missing')].map(e => e.className + ': ' + (e.textContent || '').slice(0, 200));
  return { rows, attrs, clipped, outside, overlaps, errors, elements: document.querySelectorAll('body *').length };
};

const CANDIDATES = () => {
  const out = [];
  const all = [...document.querySelectorAll('body *')];
  all.forEach((el, k) => {
    if (el.closest('script,style,helmet')) return;
    const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) return;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const tag = el.tagName.toLowerCase();
    const why = [];
    if (['button', 'a', 'input', 'select', 'textarea', 'label', 'summary'].includes(tag)) why.push(tag);
    if (el.hasAttribute('role')) why.push('role=' + el.getAttribute('role'));
    if (el.hasAttribute('tabindex')) why.push('tabindex');
    if (el.hasAttribute('title') || el.hasAttribute('data-tooltip')) why.push('title');
    if (cs.cursor === 'pointer' && (!el.parentElement || getComputedStyle(el.parentElement).cursor !== 'pointer')) why.push('pointer');
    if (why.length) out.push({ k, tag, why: why.join(','), text: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim().slice(0, 60), x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2), disabled: !!(el.disabled || el.getAttribute('aria-disabled') === 'true') });
  });
  return out;
};

(async () => {
  fs.mkdirSync(IMG, { recursive: true }); fs.mkdirSync(path.join(OUT, 'drive'), { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const logPath = path.join(OUT, shard ? `render-log-${shard.i}.json` : 'render-log.json');
  const log = fs.existsSync(logPath) && only.length ? JSON.parse(fs.readFileSync(logPath)) : { made: new Date().toISOString(), boards: {} };
  const driven = {}; // sha256 of source -> file driven
  const groups = [...new Set(boardList.map(b => contentKey(path.join(PROJ, b.file))))];
  for (const b of boardList) {
    if (only.length && !only.includes(b.file)) continue;
    if (shard && groups.indexOf(contentKey(path.join(PROJ, b.file))) % shard.n !== shard.i) continue;
    const src = path.join(PROJ, b.file); const s256 = sha(src); const ckey = contentKey(src);
    const img = `iwo-${b.page}-${b.nn}-${slug(b.title)}.png`;
    const ctx = await browser.newContext({ viewport: { width: b.w, height: b.h }, deviceScaleFactor: 1, colorScheme: 'light' });
    const page = await ctx.newPage();
    const consoleMsgs = [], failed = [];
    page.on('console', m => { if (m.type() !== 'log' && !/Failed to load resource/.test(m.text())) consoleMsgs.push(m.type() + ': ' + m.text().slice(0, 300)); });
    page.on('pageerror', e => consoleMsgs.push('pageerror: ' + e.message.slice(0, 300)));
    page.on('requestfailed', r => failed.push(r.url().replace(BASE, '')));
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url().replace(BASE, '')); });
    const url = BASE + encodeURIComponent(b.file);
    await page.goto(url, { waitUntil: 'networkidle' }); await settle(page);
    await page.screenshot({ path: path.join(IMG, img), clip: { x: 0, y: 0, width: b.w, height: b.h } });
    const ex = await page.evaluate(EXTRACT, { W: b.w, H: b.h });
    const rec = { page: b.page, nn: b.nn, title: b.title, w: b.w, h: b.h, interactiveFlag: !!b.is_interactive, sha256: s256, image: 'images/' + img,
      imageSha: sha(path.join(IMG, img)), console: consoleMsgs, failedRequests: failed.filter(f => !/fonts\//.test(f)), ...ex };
    if (driven[ckey]) {
      rec.drive = { sameAs: driven[ckey], note: (sha(path.join(PROJ, driven[ckey])) === s256 ? 'byte-identical source' : 'same source apart from its <title>') + ': driven once on ' + driven[ckey] };
    } else {
      driven[ckey] = b.file;
      const cands = await page.evaluate(CANDIDATES);
      const base = await page.evaluate(SNAP);
      const baseSet = new Set(base.texts);
      const results = [];
      let dirty = false;
      for (const c of cands) {
        if (dirty) { await page.goto(url, { waitUntil: 'networkidle' }); await settle(page); dirty = false; }
        const loc = page.locator('body *').nth(c.k);
        const r = { ...c };
        try {
          await loc.hover({ timeout: 1500, force: true }); await page.waitForTimeout(150);
          const a = await page.evaluate(SNAP); const add = a.texts.filter(x => !baseSet.has(x)); const gone = base.texts.filter(x => !a.texts.includes(x));
          r.hover = (add.length || gone.length || a.count !== base.count) ? { added: add.slice(0, 40), removed: gone.slice(0, 20), dCount: a.count - base.count } : 'no change';
          if (r.hover !== 'no change') { const f = `${b.file.replace('.dc.html', '')}-hover-${c.k}.png`; await page.screenshot({ path: path.join(OUT, 'drive', f) }); r.hoverShot = 'render/drive/' + f; }
          await page.mouse.move(1, 1); await page.waitForTimeout(80);
        } catch (e) { r.hover = 'failed: ' + e.message.split('\n')[0].slice(0, 120); }
        try {
          await loc.click({ timeout: 1500, force: true }); await page.waitForTimeout(200);
          const a = await page.evaluate(SNAP); const add = a.texts.filter(x => !baseSet.has(x)); const gone = base.texts.filter(x => !a.texts.includes(x));
          const changed = add.length || gone.length || a.count !== base.count || a.url !== base.url;
          r.click = changed ? { added: add.slice(0, 60), removed: gone.slice(0, 30), dCount: a.count - base.count, url: a.url !== base.url ? a.url : undefined } : 'no change';
          if (changed) { dirty = true; const f = `${b.file.replace('.dc.html', '')}-click-${c.k}.png`; await page.screenshot({ path: path.join(OUT, 'drive', f) }); r.clickShot = 'render/drive/' + f; }
        } catch (e) { r.click = 'failed: ' + e.message.split('\n')[0].slice(0, 120); dirty = true; }
        results.push(r);
      }
      rec.drive = { candidates: cands.length, hovered: results.filter(x => typeof x.hover !== 'string' || !x.hover.startsWith('failed')).length,
        clicked: results.filter(x => typeof x.click !== 'string' || !x.click.startsWith('failed')).length,
        exposed: results.filter(x => x.hover !== 'no change' || x.click !== 'no change').length, results };
    }
    log.boards[b.file] = rec;
    await ctx.close();
    console.log(b.page, b.nn, b.file, 'texts', ex.rows.length, 'errors', ex.errors.length, 'console', consoleMsgs.length, 'drive', rec.drive.sameAs ? 'same as ' + rec.drive.sameAs : rec.drive.candidates + ' cands, exposed ' + rec.drive.exposed);
    fs.writeFileSync(logPath, JSON.stringify(log));
  }
  await browser.close();
})();
