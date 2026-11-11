// p13_rename.mjs — 11 Nov 2026 (Rule 107, route 2-3 of 7 before any "blocked"): can a customer be RENAMED to a name that differs from
// another only in capitals or accents (the create route refuses: "Company with provided name already exists")? Opens the seeded
// "ZZCAPS Haulage" customer's page, lists its edit controls, edits the name to "zzcaps haulage" on screen and records the request and
// reply. Output exec/p13/.
import { start } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./p13/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const o = { req: [] };
const seeds = JSON.parse(fs.readFileSync(new URL('./seeds.json', import.meta.url))); const id = seeds.customers['ZZCAPS Haulage'].customerId;
p.on('response', async (r) => { if (['POST', 'PUT', 'PATCH'].includes(r.request().method()) && /\/api\//.test(r.url())) { let t = ''; try { t = (await r.text()).slice(0, 300); } catch {} o.req.push({ u: r.url().replace(/^.*\/api\//, ''), m: r.request().method(), body: (r.request().postData() || '').slice(0, 300), st: r.status(), t }); } });
await s.go('/customers/' + id); await p.waitForTimeout(4000); o.url = p.url();
o.buttons = await p.evaluate(`[...document.querySelectorAll('main [data-test-id]')].map(e => e.getAttribute('data-test-id')).filter(x => /edit|name|customer/i.test(x)).slice(0, 40)`); await s.shot('customer');
console.log('url', o.url, 'controls', JSON.stringify(o.buttons));
const edit = p.locator('[data-test-id*="edit"]').first(); if (await edit.count()) { await edit.click(); await p.waitForTimeout(2500); await s.shot('edit-open');
  o.form = await p.evaluate(`[...document.querySelectorAll('.q-dialog [data-test-id], main [data-test-id]')].filter(e => /name/i.test(e.getAttribute('data-test-id'))).map(e => e.getAttribute('data-test-id') + '=' + (e.querySelector('input')?.value ?? ''))`); console.log('form', JSON.stringify(o.form));
  const nameIn = p.locator('[data-test-id*="name"] input').first(); if (await nameIn.count()) { await nameIn.fill('zzcaps haulage'); await p.waitForTimeout(500);
    const save = p.locator('.q-dialog button, main button').filter({ hasText: /^(Save|Save & Close|Update)$/ }).first(); await save.click().catch(() => {}); await p.waitForTimeout(3000); await s.shot('after-save');
    o.toast = await p.locator('.q-notification').allInnerTexts().catch(() => []); } }
console.log('requests', JSON.stringify(o.req).slice(0, 1500), '| toast', JSON.stringify(o.toast)); s.save('rename', o); await s.close(); process.exit(0);
