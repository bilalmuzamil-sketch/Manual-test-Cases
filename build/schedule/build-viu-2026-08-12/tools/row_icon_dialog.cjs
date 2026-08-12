// row_icon_dialog.cjs — find the table row containing <match>, click the named
// Material icon inside it (edit_note / edit / more_vert), then harvest the dialog
// as RAW TEXT NODES with the CSS text-transform actually in force.
//   node row_icon_dialog.cjs <tag> <path> <row match> [icon] [extraClickText]
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const TAG = process.argv[2], PATHNAME = process.argv[3], MATCH = process.argv[4];
const ICON = process.argv[5] || 'edit_note';
const EXTRA = process.argv[6] || null;   // optional: click this text inside the dialog first

const HARVEST = `(() => {
  const dlgs = Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog]')).filter(d => getComputedStyle(d).display !== 'none');
  const scope = dlgs[dlgs.length-1] || document.body;
  const out = [];
  const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const t=n.nodeValue; if(!t||!t.trim()) continue;
    const p=n.parentElement; if(!p) continue; const cs=getComputedStyle(p);
    if(cs.display==='none'||cs.visibility==='hidden') continue;
    out.push({raw:t.trim(), transform:cs.textTransform}); }
  const ctrls=[];
  scope.querySelectorAll('button,input,.q-toggle,.q-checkbox,label').forEach(el=>{
    const cs=getComputedStyle(el); if(cs.display==='none') return;
    ctrls.push({tag:el.tagName.toLowerCase(), raw_text:(el.textContent||'').trim().slice(0,120),
      aria:el.getAttribute('aria-label'), testid:el.getAttribute('data-test-id')||el.getAttribute('data-testid'),
      checked: el.getAttribute('aria-checked'), value: el.value===undefined?undefined:String(el.value).slice(0,60),
      transform:cs.textTransform});
  });
  return {scoped: dlgs.length>0, nodes:out, controls:ctrls};
})()`;

(async () => {
  const h = await makeHarness(TAG);
  const page = h.page;
  await page.goto(APP + PATHNAME, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(9000);
  const loc = await page.evaluate(({ m, icon }) => {
    const rows = Array.from(document.querySelectorAll('tr'));
    const r = rows.find(x => (x.innerText || '').includes(m));
    if (!r) return { ok: false };
    r.scrollIntoView({ block: 'center' });
    const i = Array.from(r.querySelectorAll('i')).find(e => (e.textContent || '').trim() === icon);
    if (!i) return { ok: false, why: 'icon ' + icon + ' not in row', icons: Array.from(r.querySelectorAll('i')).map(e => e.textContent.trim()) };
    const rc = i.getBoundingClientRect();
    return { ok: true, x: rc.x + rc.width / 2, y: rc.y + rc.height / 2, row: (r.innerText || '').replace(/\s+/g, ' ').slice(0, 150) };
  }, { m: MATCH, icon: ICON });

  if (loc.ok) { await page.waitForTimeout(800); await page.mouse.click(loc.x, loc.y); await page.waitForTimeout(7000); }
  if (EXTRA) {
    const e2 = await page.evaluate((t) => {
      const els = Array.from(document.querySelectorAll('.q-dialog__inner button, .q-dialog__inner .q-tab, .q-dialog__inner .q-item, .q-dialog__inner div, .q-dialog__inner span'));
      const hits = els.filter(x => (x.innerText || '').trim().includes(t));
      const inner = hits.filter(x => !hits.some(o => o !== x && x.contains(o)));
      const p = (inner.length ? inner : hits)[0]; if (!p) return { ok: false };
      p.scrollIntoView({ block: 'center' }); const rc = p.getBoundingClientRect();
      return { ok: true, x: rc.x + rc.width / 2, y: rc.y + rc.height / 2 };
    }, EXTRA);
    if (e2.ok) { await page.waitForTimeout(700); await page.mouse.click(e2.x, e2.y); await page.waitForTimeout(5000); }
  }
  const harvest = await page.evaluate(HARVEST).catch(e => ({ error: String(e) }));
  await page.screenshot({ path: `${OUT}/${TAG}.png` }).catch(() => { });
  fs.writeFileSync(`${OUT}/${TAG}.json`, JSON.stringify({ path: PATHNAME, match: MATCH, icon: ICON, extra: EXTRA, loc, harvest, bridge_errors: h.bridgeErrors, read_at_utc: new Date().toISOString() }, null, 2));
  console.log('ROW:', loc.row || JSON.stringify(loc));
  console.log('SCOPED:', harvest.scoped, 'nodes:', (harvest.nodes || []).length);
  (harvest.nodes || []).forEach(n => console.log('  ' + JSON.stringify(n.raw) + (n.transform !== 'none' ? '  [' + n.transform + ']' : '')));
  await h.browser.close();
})();
