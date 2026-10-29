// Render chosen rows of a downloaded CSV as a plain table picture (what a spreadsheet shows). SECRET-FREE, no network.
// Usage: node render_csv.mjs <csv> <out.png> <rowPrefix,rowPrefix..> <col,col..> "<caption>"
import fs from 'fs'; import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const [csvF, out, rowsArg, colsArg, cap] = process.argv.slice(2);
const parse = l => { const o = []; let c = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = ''; } else c += ch; } o.push(c); return o; };
const lines = fs.readFileSync(csvF, 'utf8').split(/\r?\n/).filter(Boolean); const H = parse(lines[0]);
const want = rowsArg.split(','); const cols = colsArg.split(','); const ix = cols.map(c => H.indexOf(c));
const rows = lines.slice(1).map(parse).filter(v => want.includes(v[0]));
const html = `<html><body style="margin:0;font:16px Arial;padding:16px;background:#fff;display:inline-block"><div id=w style="display:inline-block"><div style="margin-bottom:8px;color:#333">${cap}</div><table border=1 cellpadding=7 style="border-collapse:collapse">` +
  `<tr style="background:#eef">${cols.map(c => `<th id="h_${c}">${c}</th>`).join('')}</tr>` + rows.map((v, i) => `<tr>${ix.map((k, j) => `<td id="c${i}_${j}">${v[k] ?? ''}</td>`).join('')}</tr>`).join('') + '</table></div></body></html>';
const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, args: ['--no-sandbox'] });
const p = await (await b.newContext({ viewport: { width: 1200, height: 400 }, deviceScaleFactor: 2 })).newPage(); await p.setContent(html);
const w = await p.locator('#w').boundingBox(); await p.setViewportSize({ width: Math.ceil(w.width + 40), height: Math.ceil(w.height + 40) });
const boxes = {}; for (let i = 0; i < rows.length; i++) for (let j = 0; j < cols.length; j++) { const bb = await p.locator(`#c${i}_${j}`).boundingBox(); boxes[`${rows[i][0]}|${cols[j]}`] = [Math.round(bb.x * 2), Math.round(bb.y * 2), Math.round(bb.width * 2), Math.round(bb.height * 2)]; }
await p.screenshot({ path: out }); console.log(JSON.stringify(boxes)); await b.close();
