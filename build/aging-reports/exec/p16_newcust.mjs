// p16_newcust.mjs — 11 Nov 2026: last route for the capitals-only / accent-only CUSTOMER pair: Customers → New Customer form on screen,
// Name "zzcaps haulage" → Save; records requests, every window shown after (a "Save anyway?" question is pressed if it appears, as the
// vendor form has one). Output exec/p16/.
import { start } from './lib.mjs';
const OUT = new URL('./p16/', import.meta.url).pathname; const s = await start(OUT, '/customers'); const p = s.page; const o = {};
const all = []; p.on('response', async (r) => { if (['POST', 'PUT'].includes(r.request().method()) && !/recent-entities|collect/.test(r.url())) { let t = ''; try { t = (await r.text()).slice(0, 200); } catch {} all.push(r.status() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '') + ' ' + t); } });
for (const name of ['zzcaps haulage', "Émile's Towing"]) {
  await s.go('/customers'); await p.waitForTimeout(3000);
  o.btns = await p.evaluate(`[...document.querySelectorAll('main button')].map(b => (b.getAttribute('data-test-id')||'') + '=' + b.innerText.trim()).filter(x => /new|create/i.test(x))`);
  await p.locator('main button', { hasText: 'New Customer' }).first().click(); await p.waitForTimeout(2500);
  const nameIn = p.locator('.q-dialog input').first(); await nameIn.click(); await nameIn.type(name, { delay: 20 }); await nameIn.press('Tab'); await s.shot('filled-' + name.replace(/\W+/g, ''));
  const n0 = all.length; await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].find(b => /^Save/.test(b.innerText.trim())); b && b.click(); })()`); await p.waitForTimeout(2500);
  const dialogs = await p.evaluate(`[...document.querySelectorAll('.q-dialog')].map(d => d.innerText.replace(/\\s+/g,' ').slice(0, 160))`); await s.shot('after-' + name.replace(/\W+/g, ''));
  const conf = p.locator('.q-dialog').filter({ hasText: /anyway/i }); if (await conf.count()) { await conf.locator('button', { hasText: /^Save$/ }).click(); await p.waitForTimeout(3000); }
  console.log(name, JSON.stringify(o.btns), '| dialogs', JSON.stringify(dialogs).slice(0, 300), '| requests', JSON.stringify(all.slice(n0)).slice(0, 400));
}
await s.close(); process.exit(0);
