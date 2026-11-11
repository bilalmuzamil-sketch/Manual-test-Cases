// p05_newpo.mjs — 11 Nov 2026: open Parts > Purchase Orders > New PO and list the form's fields/buttons (looking for the route to a
// bill for a NEW vendor). Records any POST. Does not save. Output exec/p05/.
import { start } from './lib.mjs'; import { mk } from './api.mjs';
const OUT = new URL('./p05/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const a = mk(p);
await a.post('/api/iam/change-location', { workplace_id: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', workplace_timezone: 'America/Edmonton' });
const posts = []; p.on('request', (r) => { if (r.method() === 'POST' && /\/api\//.test(r.url())) posts.push(r.url().replace(/^.*\/api\//, '') + ' :: ' + (r.postData() || '').slice(0, 300)); });
await s.go('/parts/orders'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="button_new_po"]').click(); await p.waitForTimeout(3000);
const dump = () => p.evaluate(`(() => { const d = document.querySelector('.q-dialog') || document.querySelector('main'); return [...d.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id') + '=' + (e.innerText||e.value||'').replace(/\\s+/g,' ').trim().slice(0,50)).slice(0,60); })()`);
console.log('url', p.url()); console.log('form', JSON.stringify(await dump())); await s.shot('newpo');
console.log('posts', JSON.stringify(posts)); await s.close(); process.exit(0);
