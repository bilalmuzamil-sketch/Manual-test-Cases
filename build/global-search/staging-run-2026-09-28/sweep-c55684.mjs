// C55684, done through the screen. The location lives in the user menu as "Change Location: <a
// dropdown>"; the app keeps it in browser storage, which is why switching it at the back end alone
// left the screen on the old location and produced three void readings before this.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};
const wos = s => (s.groupRows || []).filter(g => /work order/i.test(g.head)).flatMap(g => g.rows.map(r => r.slice(0, 44)));
const where = () => b.page.evaluate(() => (((document.body.innerText || '').replace(/\s+/g, ' ').match(/Staging [A-Za-z ]+ - \d+/) || [null])[0]));

async function switchLocation(to) {
  await b.page.evaluate(() => {
    const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
    const el = [...document.querySelectorAll('*')].filter(e => /^Staging [A-Za-z ]+ - \d+$/.test(t(e)));
    if (el.length) el[el.length - 1].click();
  });
  await b.page.waitForTimeout(3000);
  await b.page.evaluate(() => {                        // open the dropdown inside the menu
    const f = [...document.querySelectorAll('.q-menu .q-field')].pop();
    if (f) f.click();
  });
  await b.page.waitForTimeout(2500);
  const picked = await b.page.evaluate((name) => {
    const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
    const o = [...document.querySelectorAll('.q-menu .q-item, [role="option"]')].filter(e => t(e).includes(name));
    if (!o.length) return null; o[0].click(); return t(o[0]);
  }, to);
  await b.page.waitForTimeout(9000);
  await b.page.keyboard.press('Escape');
  await b.page.waitForTimeout(2000);
  return picked;
}
async function search(q, watch) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, watch ? 150 : 3600, true);
  const frames = [];
  if (watch) {
    for (let i = 0; i < 12; i++) {
      frames.push(await b.page.evaluate(() => {
        const m = document.querySelector('.search-modal'); if (!m) return null;
        return [...m.querySelectorAll('.search-group')]
          .filter(g => /work order/i.test((g.querySelector('.search-group__header') || {}).innerText || ''))
          .flatMap(g => [...g.querySelectorAll('.search-row')].map(r => (r.innerText || '').replace(/\s+/g, ' ').slice(0, 30)));
      }));
      await b.page.waitForTimeout(400);
    }
    await b.page.waitForTimeout(3500);
  }
  const s = await P.read(b.page);
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(800);
  return { wo: wos(s), customer: (s.groupRows || []).some(g => /customer/i.test(g.head) && g.rows.some(x => /Bridgeport Hauling/.test(x))), frames };
}
await b.page.waitForTimeout(8000);
out.startedOn = await where();
out.heavy = await search('Bridgeport');
console.log(`on ${out.startedOn}: ${out.heavy.wo.length} work orders | ${out.heavy.wo.join(' ;; ').slice(0, 130)}`);
out.picked = await switchLocation('Lethbridge');
out.nowOn = await where();
console.log('picked:', out.picked, '| screen now says:', out.nowOn);
if (out.nowOn && /Lethbridge/i.test(out.nowOn)) {
  out.leth = await search('Bridgeport', true);
  const old = new Set(out.heavy.wo.map(s => s.split(' ')[0]));
  out.leaked = [...new Set(out.leth.frames.flatMap(f => f || []).filter(r => old.has(r.split(' ')[0])))];
  console.log(`on ${out.nowOn}: ${out.leth.wo.length} work orders | customer still listed: ${out.leth.customer}`);
  if (out.leth.wo.length) console.log('   ', out.leth.wo.join(' ;; ').slice(0, 140));
  console.log('   old jobs seen at ANY moment while loading:', out.leaked.length ? out.leaked.join(' ;; ') : 'NONE');
} else {
  console.log('DID NOT SWITCH - nothing measured');
}
out.back = await switchLocation('Heavy Duty');
out.endedOn = await where();
console.log('restored to:', out.endedOn);
fs.writeFileSync('sweep-c55684.json', JSON.stringify(out, null, 1));
await b.browser.close();
