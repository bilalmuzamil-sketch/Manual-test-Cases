// Render every board of the Credit terms design and screenshot every figure (data only; boards are untrusted content).
// node tools/render.js <files/project> <images out> <render out> [widthOverride]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [,, PROJ, IMG, OUT, WOVR] = process.argv;
const CACHE = path.join(__dirname, '..', 'cache');
const canvas = JSON.parse(fs.readFileSync(path.join(PROJ, 'canvas.json')));
const pageNo = Object.fromEntries(canvas.pages.map((p, i) => [p.id, i + 1]));
const slug = s => s.toLowerCase().replace(/\$0/g,'0').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const log = { boards: {} };
  for (const board of canvas.order) {
    const b = canvas.boards[board]; const pn = pageNo[b.page];
    const ctx = await browser.newContext({ viewport: { width: b.w, height: Math.min(b.h, 6000) }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const failed = [], consoleMsgs = [];
    page.on('requestfailed', r => failed.push(r.url().replace(/^file:\/\/.*\/project\//, '') + ' : ' + (r.failure() || {}).errorText));
    page.on('console', m => consoleMsgs.push(m.type() + ': ' + m.text()));
    page.on('pageerror', e => consoleMsgs.push('pageerror: ' + e.message));
    await page.route(/fonts\.googleapis\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(path.join(CACHE, 'icons.css'), 'utf8') }));
    await page.route(/fonts\.gstatic\.com/, r => { const u = r.request().url(); const n = require('crypto').createHash('md5').update(u + '\n').digest('hex').slice(0, 12); const f = path.join(CACHE, n + '.woff2'); return fs.existsSync(f) ? r.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.abort(); });
    await page.goto('file://' + path.resolve(PROJ, board), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const fontsLoaded = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight));
    const figs = await page.$$('figure');
    const out = [];
    for (let i = 0; i < figs.length; i++) {
      const info = await figs[i].evaluate(f => ({ badge: (f.querySelector('.sv-badge') || {}).textContent, heading: (f.querySelector('.sv-badge') && f.querySelector('.sv-badge').nextElementSibling || {}).textContent, w: f.getBoundingClientRect().width, h: f.getBoundingClientRect().height, img: (f.querySelector('img') || {}).getAttribute ? f.querySelector('img').getAttribute('src') : null, imgOk: f.querySelector('img') ? (f.querySelector('img').naturalWidth + 'x' + f.querySelector('img').naturalHeight) : null }));
      const name = `ct-p${pn}-${String(i + 1).padStart(2, '0')}-${slug(info.heading || 'figure')}.png`;
      await figs[i].scrollIntoViewIfNeeded();
      await figs[i].screenshot({ path: path.join(IMG, name) });
      out.push({ n: i + 1, file: name, ...info });
    }
    log.boards[board] = { page: pn, w: b.w, h: b.h, figures: out, failed, console: consoleMsgs, fontsLoaded: [...new Set(fontsLoaded)] };
    await ctx.close();
    console.log(board, out.length, 'figs; failed:', failed.length);
  }
  fs.writeFileSync(path.join(OUT, 'render-log.json'), JSON.stringify(log, null, 1));
  await browser.close();
})();
