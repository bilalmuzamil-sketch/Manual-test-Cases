// q10_locs.mjs — 12 Nov 2026: C715383 (A/R Summary Location menu shows a search box above 8 locations). QA lead 12 Nov "1. Please do":
// make nine or more locations with open A/R documents. (1) read which locations A/R Summary lists today; (2) for each missing one, create
// "ZZAUTOTEST Q10 Loc N" through Settings > Locations > New Location (form recipe: playbook 055 line 440, stg-setup.mts), switch to it and
// make one open invoice there (seedlib customerInvoice); (3) run the test: open A/R Summary, click the Location chip, picture; type the first
// word of location A's name; picture. Positive control for "search box shows": the box is located by its placeholder, and the list count is
// read before and after typing. Output q10/out.json + pictures. PHASE=test skips seeding.
import { start, REPORTS } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./q10/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const s = await start(OUT, '/administration/locations'); const p = s.page; const a = mk(p); const o = { log: [] };
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); const log = (x) => { o.log.push(x); console.log(x); save(); };
const today = new Date().toISOString().slice(0, 10);
const arLocs = async () => { const r = await a.get(`/api/reporting/reports/ar-aging-summary/locations?asOfDate=${today}`); const c = r.j?.data?.collection || r.j?.data || []; return Array.isArray(c) ? c.map((x) => x.name || x.workplaceName || x.label) : [r.st]; };
const workplaces = async () => ((await a.get('/api/workplaces')).j?.data?.collection || []).map((x) => ({ id: x.id, name: x.name, tz: x.timezone }));
o.arBefore = await arLocs(); o.wpBefore = await workplaces(); log('A/R locations today: ' + o.arBefore.length + ' · workplaces: ' + o.wpBefore.length);
async function newLocation(name) {
  await s.go('/administration/locations'); await p.waitForTimeout(2500);
  await p.locator('button').filter({ hasText: /New Location/i }).first().click(); await p.waitForTimeout(2500);
  const d = p.locator('.q-dialog').last();
  await d.locator('.q-field').filter({ hasText: /Name \*/ }).first().locator('input').fill(name);
  const fill = async (lab, v) => { const i = d.getByLabel(lab, { exact: true }).first(); await i.click(); await i.fill(v); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(300); };
  await fill('Address 1', '1 ZZAUTOTEST Way'); await fill('City', 'Calgary'); { const z = d.getByLabel(/ZIP|Postal/i).first(); await z.click(); await z.fill('T2P 1J9'); } { const ph = d.getByLabel(/Telephone/i).first(); await ph.click(); await p.keyboard.type('4035550199', { delay: 30 }); }
  const st = d.getByLabel('State/Province').first(); await st.click(); await p.waitForTimeout(800); await p.keyboard.type('Alberta', { delay: 40 }); await p.waitForTimeout(1200);
  await p.locator('.q-menu .q-item').filter({ hasText: 'Alberta' }).first().click().catch(() => {}); await p.waitForTimeout(800);
  const tz = d.locator('.q-field').filter({ hasText: /Timezone/ }).first(); if (await tz.count()) { await tz.click(); await p.waitForTimeout(800); await p.keyboard.type('Edmonton', { delay: 50 }); await p.waitForTimeout(1500); await p.locator('.q-menu .q-item').filter({ hasText: 'America/Edmonton' }).first().click().catch(() => {}); await p.waitForTimeout(800); }
  await s.shot('new-location-' + name.slice(-5).replace(/\s/g, ''));
  const clicked = await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].filter(x => /^(Save & Close|Save|Create)$/.test(x.innerText.replace(/\\s+/g,' ').trim())).pop(); if (!b) return false; b.scrollIntoView(); b.click(); return true; })()`);
  await p.waitForTimeout(4000); const dlg = (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
  const wp = (await workplaces()).find((x) => x.name === name); return { clicked, dlg: wp ? '' : dlg, wp };
}
if (process.env.PHASE !== 'test') {
  const need = Math.max(0, 9 - o.arBefore.length) + 1; /* one spare so the list is 10 */ o.made = [];
  for (let i = 1; i <= 12 && o.made.filter((m) => m.invoiceOk).length < need; i++) {
    const name = 'ZZAUTOTEST Q10 Loc ' + i; let wp = o.wpBefore.find((x) => x.name === name);
    if (o.arBefore.includes(name)) continue;
    try {
      if (!wp) { const r = await newLocation(name); wp = r.wp; if (!wp) { log('location not made: ' + name + ' ' + JSON.stringify(r)); continue; } }
      const sw = await S.loc(a, wp.id); /* 12 Nov diag (q10/diag.json): the page must hold the same location too, else Mark Reviewed sits behind a prompt */ await p.evaluate((id) => localStorage.setItem('location', JSON.stringify(id)), wp.id); if (sw.st >= 300) { log('switch refused ' + name + ' ' + sw.st + ' ' + JSON.stringify(sw.j).slice(0, 200)); continue; }
      /* 12 Nov run 1: invoices refused "Work order is not complete." at a new location - the page still held Heavy Duty, so /workorders/<id>/lines
         showed the "Switch location?" prompt and Mark Reviewed was never pressed. goSw presses "Switch Location" when the prompt shows. */
      const goSw = async (u) => { await s.go(u); const b = p.locator('.q-dialog').getByRole('button', { name: /^Switch Location$/ }); if (await b.count()) { await b.first().click(); await p.waitForTimeout(4000); await s.go(u); } };
      const inv = await S.customerInvoice(a, p, 'ZZAUTOTEST Q10 Customer ' + i + '-' + (Date.now() % 1e4), { wp: wp.id, go: goSw });
      const ok = inv.wos.every((w) => w.invoice < 300); o.made.push({ name, id: wp.id, invoiceOk: ok, inv }); log(name + ' → invoice ' + (ok ? 'made' : 'FAILED ' + JSON.stringify(inv.wos)));
    } catch (e) { log('error ' + name + ': ' + String(e).slice(0, 300)); }
  }
  await S.loc(a); await p.evaluate(() => localStorage.setItem('location', JSON.stringify('b3c8c820-f815-4cf1-8938-10956c5ee71a'))); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
}
o.arAfter = await arLocs(); log('A/R locations today now: ' + o.arAfter.length + ' — ' + o.arAfter.join(' | '));
// the test, through the screen
await s.go(REPORTS.ars); await p.waitForTimeout(5000);
o.chip = await p.locator('main button', { hasText: /Location:/ }).first().innerText().catch(() => null);
await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1500);
const m = p.locator('.q-menu').last();
const items = () => m.evaluate((e) => [...e.querySelectorAll('.q-checkbox')].map((c) => [(c.closest('.q-item, label') || c.parentElement).innerText.replace(/\s+/g, ' ').trim().slice(0, 60), c.getAttribute('aria-checked')]));
o.s1 = { items: await items(), inputs: await m.evaluate((e) => [...e.querySelectorAll('input')].map((i) => ({ type: i.type, ph: i.getAttribute('placeholder'), aria: i.getAttribute('aria-label'), top: Math.round(i.getBoundingClientRect().top) }))), menuTop: await m.evaluate((e) => Math.round(e.getBoundingClientRect().top)), text: (await m.innerText()).replace(/\s+/g, ' ').slice(0, 400) };
o.s1pic = await s.shot('C715383-step1');
const box = m.locator('input[placeholder="Search locations"]').first(); o.boxFound = await box.count();
if (o.boxFound) { await box.click(); await p.keyboard.type('Staging', { delay: 60 }); await p.waitForTimeout(1800); o.s2 = { items: await items(), text: (await m.innerText()).replace(/\s+/g, ' ').slice(0, 400) }; o.s2pic = await s.shot('C715383-step2'); }
save(); console.log(JSON.stringify({ chip: o.chip, n1: o.s1.items.length, inputs: o.s1.inputs, boxFound: o.boxFound, n2: o.s2?.items.length, s2: o.s2?.items }, null, 0)); await s.close(); process.exit(0);
