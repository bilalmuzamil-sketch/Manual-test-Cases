// probe_rows.cjs — find the technician lane structure so an event can be dropped
// into a KNOWN different lane, and confirm whether the reassignment happens.
const { makeHarness, APP, OUT, CK, UA } = require('./harness.cjs');
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';
async function board() {
  const r = await fetch(`${API}/api/schedule/board?from=2026-08-01T00:00:00Z&to=2026-08-30T00:00:00Z`,
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  return (await r.json()).data.board;
}
(async () => {
  const h = await makeHarness('rows'); const page = h.page; const rec = {};
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(6000);
  // what test-ids exist on the grid at all?
  rec.tids = await page.evaluate(`(() => Array.from(new Set(Array.from(document.querySelectorAll('[data-test-id]'))
      .map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]+/,'<id>')))).slice(0,120))()`);
  // the left-hand technician labels give the lane y-centres
  rec.lanes = await page.evaluate(`(() => {
     const labs = Array.from(document.querySelectorAll('*')).filter(e=>{
        const r=e.getBoundingClientRect();
        return r.x<330 && r.width>60 && r.height>30 && r.height<200 && r.y>230 && r.y<innerHeight-40
               && e.children.length<=3 && /^[A-Z][a-z]+ [A-Z]/.test((e.innerText||'').trim());
     }).map(e=>{const r=e.getBoundingClientRect(); return { name:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,30),
        y:Math.round(r.y+r.height/2), h:Math.round(r.height), x:Math.round(r.x) };});
     const seen=new Set(); return labs.filter(l=>{const k=l.name+l.y; if(seen.has(k))return false; seen.add(k); return true;}).slice(0,14); })()`);
  await page.screenshot({ path: `${OUT}/rows-01.png` }).catch(() => {});
  await h.browser.close();
  fs.writeFileSync(`${OUT}/rows.json`, JSON.stringify(rec, null, 1));
  console.log('GRID TEST-IDS:', JSON.stringify(rec.tids, null, 0).slice(0, 1400));
  console.log('\nLANES:', JSON.stringify(rec.lanes, null, 1));
})();
