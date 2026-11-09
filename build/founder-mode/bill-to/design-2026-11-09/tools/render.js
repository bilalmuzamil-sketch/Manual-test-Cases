// Render every board of the Bill To design at its own width (light theme), screenshot every figure, and
// hover + click every element on each board from a fresh load, recording anything that changes (Rule 120).
// Board content is untrusted data; nothing from it is executed except by the browser sandbox.
// node tools/render.js <files/project> <images out> <render out>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [,, PROJ, IMG, OUT] = process.argv;
const canvas = JSON.parse(fs.readFileSync(path.join(PROJ, 'canvas.json')));
const pageNo = Object.fromEntries(canvas.pages.map(p => [p.id, parseInt(p.id.slice(1), 10)]));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
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
    const url = 'file://' + path.resolve(PROJ, board);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const pageInfo = await page.evaluate(() => ({
      title: document.title,
      bodyW: document.body.scrollWidth, bodyH: document.body.scrollHeight,
      xdcDefined: !!customElements.get('x-dc'), DCLogic: typeof window.DCLogic,
      helmetVisible: (() => { const h = document.querySelector('helmet'); return h ? getComputedStyle(h).display : null; })(),
      scriptBlocks: [...document.querySelectorAll('script[type="text/x-dc"]')].map(s => s.textContent.trim()),
      imgs: [...document.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), natural: i.naturalWidth + 'x' + i.naturalHeight, shown: Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height) })),
      fonts: [...new Set([...document.querySelectorAll('h2, figure span, li')].map(e => getComputedStyle(e).fontFamily))],
      fontsLoaded: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family),
    }));
    await page.screenshot({ path: path.join(OUT, `board-p${pn}-${board.replace('.dc.html', '')}.png`), fullPage: true });
    const figs = await page.$$('figure');
    const out = [];
    for (let i = 0; i < figs.length; i++) {
      const info = await figs[i].evaluate(f => {
        const badge = f.querySelector('.sv-badge'); const cs = badge ? getComputedStyle(badge) : null;
        return { badge: badge && badge.textContent, badgeClass: badge && badge.className, badgeLook: cs && { bg: cs.backgroundColor, color: cs.color, border: cs.borderColor, h: badge.getBoundingClientRect().height, radius: cs.borderRadius },
          heading: badge && badge.nextElementSibling && badge.nextElementSibling.textContent,
          w: Math.round(f.getBoundingClientRect().width), h: Math.round(f.getBoundingClientRect().height),
          img: f.querySelector('img') && f.querySelector('img').getAttribute('src'), alt: f.querySelector('img') && f.querySelector('img').getAttribute('alt'),
          captions: [...f.querySelectorAll('li')].map(l => l.textContent.replace(/\s+/g, ' ').trim()) };
      });
      const name = `bt-p${pn}-${String(i + 1).padStart(2, '0')}-${slug((info.badge || '').startsWith('Production') ? 'before-' + info.heading : 'after-' + info.heading)}.png`;
      await figs[i].scrollIntoViewIfNeeded();
      await figs[i].screenshot({ path: path.join(IMG, name) });
      // header + caption strip (picture hidden) so badge, heading and caption are viewed beside the full-size shot
      await figs[i].evaluate(f => { const im = f.querySelector('img'); if (im) im.style.display = 'none'; });
      fs.mkdirSync(path.join(OUT, 'strips'), { recursive: true });
      await figs[i].screenshot({ path: path.join(OUT, 'strips', name) });
      await figs[i].evaluate(f => { const im = f.querySelector('img'); if (im) im.style.display = ''; });
      out.push({ n: i + 1, file: name, ...info });
    }
    // Rule 120: hover and click every element, each from a fresh load; record any DOM, URL or style change.
    const count = await page.evaluate(() => document.querySelectorAll('body *').length);
    const interactions = [];
    const snapshot = () => page.evaluate(() => document.body.innerHTML.length + ':' + document.body.innerText.length + ':' + location.href + ':' + document.querySelectorAll('body *').length);
    for (let k = 0; k < count; k++) {
      await page.goto(url, { waitUntil: 'load' });
      const before = await snapshot();
      const desc = await page.evaluate(k => { const el = document.querySelectorAll('body *')[k]; if (!el) return null; const r = el.getBoundingClientRect(); return { tag: el.tagName.toLowerCase(), cls: el.className && el.className.baseVal === undefined ? el.className : '', text: (el.innerText || el.getAttribute('alt') || '').slice(0, 40), visible: r.width > 0 && r.height > 0, cursor: getComputedStyle(el).cursor, title: el.getAttribute('title') }; }, k);
      if (!desc || !desc.visible) { interactions.push({ k, ...(desc || {}), result: 'not visible (no box)' }); continue; }
      const loc = page.locator('body *').nth(k);
      let res = [];
      try { await loc.hover({ timeout: 2000, force: true }); await page.waitForTimeout(60); const a = await snapshot(); res.push(a === before ? 'hover: no change' : 'hover: CHANGED ' + a); } catch (e) { res.push('hover failed: ' + e.message.split('\n')[0]); }
      try { await loc.click({ timeout: 2000, force: true }); await page.waitForTimeout(60); const a = await snapshot(); res.push(a === before ? 'click: no change' : 'click: CHANGED ' + a); } catch (e) { res.push('click failed: ' + e.message.split('\n')[0]); }
      interactions.push({ k, ...desc, result: res.join('; ') });
    }
    const changed = interactions.filter(x => /CHANGED|failed/.test(x.result || ''));
    log.boards[board] = { page: pn, canvasTitle: b.title, w: b.w, h: b.h, ...pageInfo, figures: out, failed, console: consoleMsgs, elements: count, hoveredClicked: interactions.filter(x => x.visible).length, notVisible: interactions.filter(x => !x.visible).map(x => x.tag + (x.cls ? '.' + x.cls : '')), changedOrFailed: changed, cursors: [...new Set(interactions.map(x => x.cursor).filter(Boolean))] };
    await ctx.close();
    console.log(board, out.length, 'figs; elements', count, 'changed/failed', changed.length, 'failed requests', failed.length);
  }
  fs.writeFileSync(path.join(OUT, 'render-log.json'), JSON.stringify(log, null, 1));
  await browser.close();
})();
