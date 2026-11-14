// Checklist line 9 (L-21) harness probe: what the DESIGN's own CSS does with long typed names. The design draws no long or special-character
// names, so this is a probe of the design's styles, not a design statement: on representative boards every occurrence of a record name a user
// types (tier, matrix, category, customer) is replaced in the rendered page by a stress value, and we measure whether it wraps in its own
// row, is shortened with an ellipsis, overflows its cell, overlaps a neighbour, pushes columns or widens the page. Pictures in render/stress/.
// node tools/stress.js   (server: tools/serve.js on 127.0.0.1:8771)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'); const OUT = path.join(ROOT, 'render', 'stress'); fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:8771/';
const blist = JSON.parse(fs.readFileSync(path.join(ROOT, 'render', 'board-list.json')));
const BOARDS = ['T01-TiersList', 'TP01-TierPage', 'T05-RowMenu', 'MX01-Matrices', 'MP01-Matrix', 'ED01-Edit', 'CA01-Categories', 'CA03-Category', 'CU01-Customers', 'CU02-CustomerCard', 'CU03-EditCustomer', 'CU04-TierPicked',
  'PH02-TierSheet', 'MC01-CustomersTab', 'MC02-ManageAdd', 'MC03-TickTwo', 'WO01-Lines', 'WO04-PartsTab', 'PSL01-PartSale', 'CC02-Change', 'G12-PrevCustomer', 'RP01-ByTier', 'RP02-RowOpen', 'RP06-ByCategory', 'GR-CustFilter', 'GR-CatFilter', 'RP03-Filter', 'SV02-ChangeAll', 'T21-ArchiveConfirm', 'MC10-RemoveConfirm', 'CA07-PickMatrix', 'NM02-Cats'];
const NAMES = ['Tier 2', 'Tier 3', 'Fleet Old', 'Fleet Plus', 'Stop 40', 'Tread Plus', 'Fluids 30', 'Brakes', 'Tires', 'Acme Freight', 'Northway Haulers'];
const VARIANTS = {
  spaces: 'Northern Alberta Heavy Equipment Fleet Services Preferred Customer Pricing',
  nospaces: 'NorthernAlbertaHeavyEquipmentFleetServicesPreferredCustomerPricingTier',
  special: 'A&B "Fleet" O\'Neil <Tier> & Co.',
};
(async () => {
  const browser = await chromium.launch(); const res = [];
  for (const stem of BOARDS) {
    const b = blist.find(x => x.file === stem + '.dc.html'); if (!b) { res.push({ board: stem, missing: true }); continue; }
    for (const [vn, val] of Object.entries(VARIANTS)) {
      const ctx = await browser.newContext({ viewport: { width: b.w, height: b.h }, deviceScaleFactor: 1 }); await ctx.route(u => !u.href.startsWith(BASE), r => r.abort());
      const page = await ctx.newPage(); await page.goto(BASE + encodeURIComponent(b.file), { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
      const r = await page.evaluate(({ NAMES, val }) => {
        const before = { scrollW: document.documentElement.scrollWidth, ths: [...document.querySelectorAll('thead th')].map(t => Math.round(t.getBoundingClientRect().left)), rowsH: [...document.querySelectorAll('tbody tr')].slice(0, 12).map(t => Math.round(t.getBoundingClientRect().height)) };
        const hits = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; const nodes = [];
        while ((n = w.nextNode())) { const s = n.nodeValue; for (const nm of NAMES) if (s.includes(nm) && !n.parentElement.closest('script,style,title')) { nodes.push([n, nm]); break; } }
        for (const [node, nm] of nodes) { node.nodeValue = node.nodeValue.split(nm).join(val); hits.push({ el: node.parentElement, name: nm }); }
        for (const i of document.querySelectorAll('input')) for (const nm of NAMES) if (i.value.includes(nm)) { i.value = i.value.split(nm).join(val); hits.push({ el: i, name: nm, input: true }); }
        const after = { scrollW: document.documentElement.scrollWidth, ths: [...document.querySelectorAll('thead th')].map(t => Math.round(t.getBoundingClientRect().left)), rowsH: [...document.querySelectorAll('tbody tr')].slice(0, 12).map(t => Math.round(t.getBoundingClientRect().height)) };
        const out = hits.slice(0, 40).map(h => {
          const el = h.el; const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
          let cell = el.closest('td,th,li,button,.sv-chip,.tp-rchip,.sv-menu__row,.sv-dd-row,h1,.sv-crumbs,.sv-field,.sv-toast,.sv-modal__title,.tp2-mxcard,.sv-tab,label') || el.parentElement;
          const cr = cell.getBoundingClientRect();
          // ellipsis / clipping anywhere up to the cell
          let e = el, ellipsis = false, clipped = false; while (e && e !== cell.parentElement) { const c = getComputedStyle(e); if (c.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) ellipsis = true; if ((c.overflow === 'hidden' || c.overflowX === 'hidden') && e.scrollWidth > e.clientWidth + 1) clipped = true; e = e.parentElement; }
          const overflowCell = r.right > cr.right + 1 || r.left < cr.left - 1;
          const lines = Math.round(r.height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3));
          // overlap with any other text box outside this cell
          let overlap = '';
          const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let m;
          while ((m = tw.nextNode())) { const p = m.parentElement; if (!p || cell.contains(p) || p.contains(el) || !m.nodeValue.trim() || p.closest('script,style,title')) continue; const rg = document.createRange(); rg.selectNodeContents(m); const q = rg.getBoundingClientRect(); if (!q.width) continue;
            const vis = r; const ix = Math.min(vis.right, q.right, cr.right + 2000) - Math.max(vis.left, q.left), iy = Math.min(vis.bottom, q.bottom) - Math.max(vis.top, q.top);
            const pc = getComputedStyle(p); if (ix > 2 && iy > 2 && pc.visibility !== 'hidden') { overlap = m.nodeValue.trim().slice(0, 40); break; } }
          return { name: h.name, where: (cell.tagName + '.' + String(cell.className).split(' ')[0]).slice(0, 50), input: !!h.input, lines, ellipsis, clipped, overflowCell, overlap, w: Math.round(r.width), cellW: Math.round(cr.width) };
        });
        return { before, after, hits: out, pageWider: after.scrollW > before.scrollW, columnsMoved: JSON.stringify(before.ths) !== JSON.stringify(after.ths), rowsTaller: before.rowsH.map((h, i) => (after.rowsH[i] || h) - h).filter(x => x).length };
      }, { NAMES, val });
      const f = `${stem}-${vn}.png`; await page.screenshot({ path: path.join(OUT, f), fullPage: false });
      res.push({ board: stem, title: b.title, variant: vn, value: val, shot: 'render/stress/' + f, ...r, before: undefined, after: undefined, thsBefore: r.before.ths, thsAfter: r.after.ths });
      await ctx.close();
    }
    console.log('stress', stem);
  }
  fs.writeFileSync(path.join(ROOT, 'inventory', 'stress-probe.json'), JSON.stringify(res, null, 1));
  await browser.close();
})();
