// p14b_control.mjs — POSITIVE CONTROL for p14 (does Edit Customer save at all from the script?). Copied from p14_rename2.mjs — 11 Nov 2026 (Rule 107 route: rename instead of create): make customer "ZZCAPS2 Haulage" with one open invoice, then
// on its page Edit Customer → Name "zzcaps haulage" → Save; the same for "ZZEMILE2 Towing" → "Émile's Towing". Records the save request,
// reply and message. Output exec/p14b/ + seeds.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const F = new URL('./seeds.json', import.meta.url).pathname; const seeds = JSON.parse(fs.readFileSync(F));
const OUT = new URL('./p14b/', import.meta.url).pathname; const s = await start(OUT, '/workorders'); const p = s.page; const a = mk(p); await S.loc(a); const o = {};
const reqs = []; p.on('response', async (r) => { if (['POST', 'PUT', 'PATCH'].includes(r.request().method()) && /\/api\//.test(r.url()) && !/recent-entities|collect/.test(r.url())) { let t = ''; try { t = (await r.text()).slice(0, 300); } catch {} reqs.push({ u: r.url().replace(/^.*\/api\//, ''), body: (r.request().postData() || '').slice(0, 200), st: r.status(), t }); } });
for (const [tmp, target] of [['ZZCAPS2 Haulage', 'ZZCAPS2 Haulage RENAMETEST']]) {
  const c = seeds.customers[tmp] ?? (seeds.customers[target]?.renamedFrom ? seeds.customers[target] : await S.customerInvoice(a, p, tmp, { go: s.go }));
  await s.go('/customers/' + c.customerId); await p.waitForTimeout(3500); await p.locator('[data-test-id="button_edit_customer"]').click(); await p.waitForTimeout(6000); console.log('save button state', await p.evaluate(`(() => { const b = document.querySelector('.q-dialog button[data-test-id="button_save_customer"]'); return b ? { disabled: b.disabled, cls: b.className.slice(0, 120), aria: b.getAttribute('aria-disabled') } : null; })()`).then(JSON.stringify));
  const nameIn = p.locator('.q-dialog input').first(); await nameIn.click(); await nameIn.press('Control+A'); await nameIn.type(target, { delay: 20 }); await nameIn.press('Tab'); await p.waitForTimeout(400);
  const n0 = reqs.length; o.dialogButtons = await p.evaluate(`[...document.querySelectorAll('.q-dialog button')].map(b => (b.getAttribute('data-test-id')||'') + '=' + b.innerText.trim())`); console.log('dialog buttons', JSON.stringify(o.dialogButtons));
  const all = []; const lis = (r) => all.push(r.request().method() + ' ' + r.status() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); p.on('response', lis);
  await p.evaluate(`document.querySelector('.q-dialog button[data-test-id="button_save_customer"]').click()`); await p.waitForTimeout(3500); p.off('response', lis); console.log('after DOM click, all responses:', JSON.stringify(all.filter(x => !/recent-entities|collect|\.js|\.css|\.png|\.svg|\.woff/.test(x))).slice(0, 700)); await p.waitForTimeout(3500);
  await p.locator('.q-dialog .scroll, .q-dialog .q-card').first().evaluate(e => e.scrollTop = 0).catch(() => {}); await p.waitForTimeout(500); await s.shot('after-save-top-' + tmp.replace(/\W+/g, '')); const nameErr = await p.locator('.q-dialog').first().innerText().catch(() => ''); o.dialogText = (o.dialogText || []).concat([nameErr.slice(0, 300)]); console.log('dialog after save:', nameErr.replace(/\s+/g, ' ').slice(0, 250));
  const toast = await p.locator('.q-notification').allInnerTexts().catch(() => []); const shown = await p.locator('[data-test-id="text_customer_name"]').innerText().catch(() => '');
  o[target] = { tmp, customerId: c.customerId, requests: reqs.slice(n0), toast, nameNow: shown }; await s.shot('rename-' + tmp.replace(/\W+/g, ''));
  if (/haulage|towing/i.test(shown) && shown.trim() === target) seeds.customers[target] = { ...c, name: target, renamedFrom: tmp }; else seeds.customers[tmp] = c;
  console.log(target, '→ shown now:', JSON.stringify(shown), '| toast', JSON.stringify(toast), '| save', JSON.stringify(reqs.slice(n0)).slice(0, 400));
}
fs.writeFileSync(F, JSON.stringify(seeds, null, 1)); s.save('rename2', o); await s.close(); process.exit(0);
