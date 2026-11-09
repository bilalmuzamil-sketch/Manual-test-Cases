// Stack the per-figure header+caption strips (picture hidden) into contact sheets, max ~1700px tall each, for viewing.
// node tools/sheets.js render/strips render/sheets
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const [,, IN, OUT] = process.argv; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1640, height: 400 } });
  const files = fs.readdirSync(IN).filter(f => f.endsWith('.png')).sort((a, c) => a.localeCompare(c, 'en', { numeric: true }));
  const dims = {};
  for (const f of files) { const buf = fs.readFileSync(path.join(IN, f)); dims[f] = { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }
  let groups = [], cur = [], hsum = 0, page = null;
  for (const f of files) { const pg = f.split('-')[1]; if ((hsum + dims[f].h + 24 > 1700 || pg !== page) && cur.length) { groups.push(cur); cur = []; hsum = 0; } cur.push(f); hsum += dims[f].h + 24; page = pg; }
  if (cur.length) groups.push(cur);
  let n = 0;
  for (const g of groups) {
    const html = '<body style="margin:0;background:#fff;font:11px monospace">' + g.map(f => `<div style="background:#eee;padding:2px 4px">${f}</div><img src="file://${path.resolve(IN, f)}" style="display:block;border-bottom:2px solid #f0a">`).join('') + '</body>';
    const tmp = path.resolve(OUT, '_s.html'); fs.writeFileSync(tmp, html); await p.goto('file://' + tmp); await p.waitForTimeout(150);
    n++; await p.screenshot({ path: path.join(OUT, `sheet-${String(n).padStart(2, '0')}-${g[0].split('-')[1]}.png`), fullPage: true }); fs.unlinkSync(tmp);
  }
  console.log('sheets', n, 'strips', files.length); await b.close();
})();
