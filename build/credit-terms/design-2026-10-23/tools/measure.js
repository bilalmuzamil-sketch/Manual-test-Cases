// Visual measurements of every drawn ("This design") figure of the Credit terms boards, plus a reflow check at other widths.
// node tools/measure.js <files/project> <out json>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [,, PROJ, OUT] = process.argv;
const CACHE = path.join(__dirname, '..', 'cache');
const canvas = JSON.parse(fs.readFileSync(path.join(PROJ, 'canvas.json')));
const pageNo = Object.fromEntries(canvas.pages.map((p, i) => [p.id, i + 1]));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const result = {};
  for (const board of canvas.order) {
    const b = canvas.boards[board];
    const ctx = await browser.newContext({ viewport: { width: b.w, height: Math.min(b.h, 6000) } });
    const page = await ctx.newPage();
    await page.route(/fonts\.googleapis\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(path.join(CACHE, 'icons.css'), 'utf8') }));
    await page.route(/fonts\.gstatic\.com/, r => { const n = require('crypto').createHash('md5').update(r.request().url() + '\n').digest('hex').slice(0, 12); const f = path.join(CACHE, n + '.woff2'); return fs.existsSync(f) ? r.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.abort(); });
    await page.goto('file://' + path.resolve(PROJ, board));
    await page.evaluate(() => document.fonts.ready);
    const measure = () => [...document.querySelectorAll('figure')].map((fig, i) => {
      const fr = fig.getBoundingClientRect();
      const rel = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left - fr.left), y: Math.round(r.top - fr.top), w: Math.round(r.width), h: Math.round(r.height) }; };
      const cs = el => getComputedStyle(el);
      const txt = el => el.innerText.replace(/\s+/g, ' ').trim();
      const o = { n: i + 1, badge: txt(fig.querySelector('.sv-badge')), heading: txt(fig.querySelector('.sv-badge').nextElementSibling) };
      if (fig.querySelector('img')) { o.img = fig.querySelector('img').getAttribute('src'); return o; }
      const screen = fig.children[1];
      o.screen = rel(screen);
      o.tabs = [...screen.querySelectorAll('.sv-tabs-row button, .sv-tabs button')].map(t => ({ text: txt(t), color: cs(t).color, weight: cs(t).fontWeight, borderBottom: cs(t).borderBottomWidth + ' ' + cs(t).borderBottomColor, countBg: t.querySelector('.sv-badge') ? cs(t.querySelector('.sv-badge')).backgroundColor : null, box: rel(t) }));
      o.tables = [...screen.querySelectorAll('table')].map(tb => ({ headers: [...tb.querySelectorAll('th')].map(th => ({ text: txt(th), visibleText: th.offsetWidth && cs(th).color !== 'rgba(0, 0, 0, 0)' ? txt(th) : '', x: rel(th).x, w: rel(th).w, align: cs(th).textAlign, size: cs(th).fontSize, weight: cs(th).fontWeight, color: cs(th).color })), rows: tb.querySelectorAll('tbody tr').length, rowH: tb.querySelector('tbody tr') ? Math.round(tb.querySelector('tbody tr').getBoundingClientRect().height) : null, firstCells: [...(tb.querySelector('tbody tr') || { children: [] }).children].map(td => ({ align: cs(td).textAlign, size: cs(td).fontSize, color: cs(td).color })) }));
      o.badges = [...screen.querySelectorAll('.sv-badge')].map(bd => ({ text: txt(bd), bg: cs(bd).backgroundColor, color: cs(bd).color, border: cs(bd).borderColor, h: rel(bd).h, prev: bd.previousElementSibling ? (bd.previousElementSibling.getAttribute('aria-label') || txt(bd.previousElementSibling)).slice(0, 30) : null }));
      o.tooltips = [...screen.querySelectorAll('div')].filter(d => cs(d).backgroundColor.startsWith('rgba(97, 97, 97')).map(d => { const host = d.closest('span[aria-label], button, label, .sv-field, td') || d.parentElement; const hr = rel(host), dr = rel(d); return { text: d.innerText.replace(/\n/g, ' / '), box: dr, hostLabel: (host.getAttribute('aria-label') || txt(host)).slice(0, 40), side: dr.x >= hr.x + hr.w - 2 ? 'right of host' : dr.x + dr.w <= hr.x + 2 ? 'left of host' : dr.y >= hr.y + hr.h - 2 ? 'below host' : dr.y + dr.h <= hr.y + 2 ? 'above host' : 'overlapping host', size: cs(d).fontSize, color: cs(d).color, bg: cs(d).backgroundColor, radius: cs(d).borderRadius }; });
      o.menus = [...screen.querySelectorAll('button.sv-menu__row')].map(m => m.parentElement.closest('div')).filter((v, k, a) => a.indexOf(v) === k).map(mn => { const box = mn.closest('[style*="position: absolute"]') || mn; return { box: rel(box), items: [...box.querySelectorAll('button.sv-menu__row')].map(it => ({ text: txt(it), color: cs(it).color, disabled: it.classList.contains('is-disabled'), active: it.classList.contains('is-active'), danger: it.classList.contains('is-danger'), icon: it.querySelector('svg') ? (it.querySelector('svg').getAttribute('data-icon') || it.querySelector('svg').getAttribute('aria-label') || 'svg') : (it.querySelector('.material-icons') ? txt(it.querySelector('.material-icons')) : null) })), separators: box.querySelectorAll('.sv-menu__sep, hr').length }; });
      o.modals = [...screen.querySelectorAll('.sv-modal')].map(md => ({ title: txt(md.querySelector('.sv-modal__title') || md), box: rel(md), titleSize: md.querySelector('.sv-modal__title') ? cs(md.querySelector('.sv-modal__title')).fontSize : null, radius: cs(md).borderRadius, buttons: [...md.querySelectorAll('.sv-modal__footer button, .sv-modal__footer a')].map(bt => ({ text: txt(bt), bg: cs(bt).backgroundColor, color: cs(bt).color, border: cs(bt).borderColor, disabled: bt.disabled || cs(bt).opacity < 1 })), hints: [...md.querySelectorAll('.sv-hint')].map(h => ({ text: txt(h), color: cs(h).color })), fields: [...md.querySelectorAll('.sv-field')].map(f => { const inp = f.querySelector('input,select,textarea'); const lab = f.querySelector('label'); return { label: lab ? txt(lab) : '', value: inp ? (inp.value || inp.getAttribute('value') || '') : '', disabled: inp ? inp.disabled : false, border: inp ? cs(inp).borderColor : '', bg: inp ? cs(inp).backgroundColor : '', box: rel(f) }; }), alerts: [...md.querySelectorAll('.sv-alert')].map(a => ({ text: txt(a), bg: cs(a).backgroundColor, color: cs(a).color })) }));
      o.toasts = [...screen.querySelectorAll('div')].filter(d => /check_circle/.test(d.innerText) && cs(d).position === 'absolute').map(d => ({ text: txt(d), box: rel(d), bg: cs(d).backgroundColor, color: cs(d).color }));
      o.primaryButtons = [...screen.querySelectorAll('.sv-btn--primary')].filter(bt => !bt.closest('.sv-modal')).map(bt => ({ text: txt(bt), box: rel(bt) }));
      // overlap / clipping of visible text leaves (excluding overlays drawn on purpose)
      const leaves = [...screen.querySelectorAll('*')].filter(el => el.children.length === 0 && el.innerText && el.innerText.trim() && el.offsetWidth && !el.closest('[style*="rgba(97, 97, 97"]') && !el.closest('.sv-modal') && !el.closest('.sv-scrim'));
      o.clipped = leaves.filter(el => el.scrollWidth > el.clientWidth + 1 && cs(el).overflow !== 'visible').map(el => txt(el)).slice(0, 20);
      o.ellipsis = leaves.filter(el => cs(el).textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1).map(el => txt(el));
      return o;
    });
    const figs = await page.evaluate(measure);
    // reflow: make each drawn app frame 1536 / 1280 wide and check for text overlap in table rows and page head
    const reflow = {};
    for (const W of [1536, 1280]) {
      reflow[W] = await page.evaluate((W) => [...document.querySelectorAll('figure')].map((fig, i) => {
        if (fig.querySelector('img')) return null;
        const s = fig.children[1]; s.style.width = W + 'px';
        const rows = [...s.querySelectorAll('tr')];
        let overlaps = 0, wrapped = [];
        for (const tr of rows) { const cells = [...tr.children].map(c => c.getBoundingClientRect()); for (let k = 1; k < cells.length; k++) if (cells[k].left < cells[k - 1].right - 1) overlaps++; const first = tr.children[0]; if (first && first.getBoundingClientRect().height > 60) wrapped.push(first.innerText.trim().slice(0, 40)); }
        const head = s.querySelector('.sv-page-head'); let headOverlap = false;
        if (head) { const kids = [...head.children].map(c => c.getBoundingClientRect()).filter(r => r.width); for (let k = 1; k < kids.length; k++) if (kids[k].left < kids[k - 1].right - 1) headOverlap = true; }
        return { n: i + 1, overlaps, headOverlap, wrapped, scrollW: s.scrollWidth };
      }).filter(Boolean), W);
      await page.screenshot({ path: path.join(path.dirname(OUT), `reflow-${board.replace('.dc.html', '')}-${W}.png`), clip: { x: 0, y: 0, width: Math.min(b.w, W * 2 + 200), height: 1200 } });
    }
    result[board] = { page: pageNo[b.page], width: b.w, figures: figs, reflow };
    await ctx.close();
    console.log(board, figs.length);
  }
  fs.writeFileSync(OUT, JSON.stringify(result, null, 1));
  await browser.close();
})();
