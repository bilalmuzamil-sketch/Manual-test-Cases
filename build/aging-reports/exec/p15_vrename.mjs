// p15_vrename.mjs — 11 Nov 2026 (Rule 104/107, third route for the capitals-only VENDOR pair): create vendor "ZZCAPS2 Supply", then on
// its page Edit vendor → Name "zzcaps supply" → Save (typed, Tab, DOM click — the p14b-proved way); positive control: the same edit to
// "ZZCAPS2 Supply RENAMETEST" first. Records requests/replies. Output exec/p15/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs';
const OUT = new URL('./p15/', import.meta.url).pathname; const s = await start(OUT, '/workorders'); const p = s.page; const a = mk(p); await S.loc(a);
const id = await S.vendor(a, 'ZZCAPS2 Supply ' + (Date.now() % 1e4)); const o = { id, tries: [] };
for (const target of ['ZZCAPS2 Supply RENAMETEST ' + (Date.now() % 1e4), 'zzcaps supply']) {
  await s.go('/parts/vendor/' + id + '/unpaid-invoices'); await p.waitForTimeout(4000); await p.locator('[data-test-id="button_edit_vendor"]').click(); await p.waitForTimeout(5000);
  const all = []; const lis = async (r) => { if (['POST', 'PUT', 'PATCH'].includes(r.request().method()) && !/recent-entities|collect/.test(r.url())) { let t = ''; try { t = (await r.text()).slice(0, 200); } catch {} all.push(r.status() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '') + ' ' + t); } }; p.on('response', lis);
  const nameIn = p.locator('.q-dialog input').first(); await nameIn.click(); await nameIn.press('Control+A'); await nameIn.type(target, { delay: 20 }); await nameIn.press('Tab');
  const btns = await p.evaluate(`[...document.querySelectorAll('.q-dialog button')].map(b => (b.getAttribute('data-test-id')||'') + '=' + b.innerText.trim())`);
  await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].find(b => /save/i.test(b.getAttribute('data-test-id')||'') || /^Save/.test(b.innerText.trim())); b && b.click(); })()`); await p.waitForTimeout(3500); p.off('response', lis);
  await s.shot('after-' + (target.startsWith('zz') ? 'pair' : 'control')); o.tries.push({ target, btns, responses: all }); console.log(target, JSON.stringify(btns), JSON.stringify(all).slice(0, 500));
}
s.save('vrename', o); await s.close(); process.exit(0);
