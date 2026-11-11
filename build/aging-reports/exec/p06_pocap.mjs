// p06_pocap.mjs — 11 Nov 2026 (seeding for the aging tests, Rule 107): create vendor "ZZAUTOTEST POCAP <n>" through the API (tax id
// copied from an existing vendor), then make a purchase order for it ON SCREEN (New PO: vendor, description, qty 1, cost 10.00, first
// category, Add, Save & Close) and record the POST bodies, so later bills can be made the same way. Output exec/p06/.
import { start } from './lib.mjs'; import { mk } from './api.mjs';
const OUT = new URL('./p06/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const a = mk(p); const o = { posts: [] };
await a.post('/api/iam/change-location', { workplace_id: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', workplace_timezone: 'America/Edmonton' });
p.on('request', (r) => { if (r.method() === 'POST' && /\/api\//.test(r.url())) o.posts.push({ u: r.url().replace(/^.*\/api\//, ''), body: r.postData() }); });
p.on('response', async (r) => { if (r.request().method() === 'POST' && /\/api\/(inventory|parts)/.test(r.url())) { let t = ''; try { t = (await r.text()).slice(0, 400); } catch {} o.posts.push({ resp: r.url().replace(/^.*\/api\//, ''), st: r.status(), t }); } });
const ref = await a.get('/api/parts-catalogue/vendor/98c705a1-ba42-42c1-b291-303deb797d3b'); o.refVendor = ref.j; const tax_id = ref.j?.data?.tax_id ?? ref.j?.data?.vendor?.tax_id ?? ref.j?.data?.taxId;
const name = 'ZZAUTOTEST POCAP ' + (Date.now() % 100000);
const rv = ref.j?.data?.vendor ?? ref.j?.data ?? {}; o.add = await a.post('/api/parts-catalogue/add-vendor', { name, tax_id, country: 'CA', credit_term: rv.credit_term ?? rv.creditTerm ?? 'NET_30', credit_limit: 0 }); console.log('add-vendor', o.add.st, JSON.stringify(o.add.j).slice(0, 300), 'tax', tax_id);
await s.go('/parts/orders'); await p.waitForTimeout(4000); await p.locator('[data-test-id="button_new_po"]').click(); await p.waitForTimeout(2500);
const sel = async (tid, text) => { await p.locator(`[data-test-id="${tid}"]`).click(); await p.waitForTimeout(800); if (text) await p.keyboard.type(text, { delay: 30 }); await p.waitForTimeout(1500);
  const opt = p.locator('.q-menu .q-item').first(); const t = await opt.innerText().catch(() => ''); await opt.click().catch(() => {}); await p.waitForTimeout(800); return t; };
o.vendorPicked = await sel('select_order_vendor', name);
const state = () => p.evaluate(`[...document.querySelectorAll('.q-dialog input, .q-dialog [data-test-id]')].filter(e => e.tagName === 'INPUT' || /^(input|select)_/.test(e.getAttribute('data-test-id')||'')).map(e => (e.getAttribute('data-test-id') || e.closest('[data-test-id]')?.getAttribute('data-test-id') || '?') + (e.tagName === 'INPUT' ? ':input' + (e.disabled ? '[disabled]' : '') + '=' + e.value : '')).slice(0, 40)`);
console.log('after vendor', JSON.stringify(await state()));
await p.locator('[data-test-id="select_part"]').click(); await p.waitForTimeout(600); await p.keyboard.type('ZZAGING-' + (Date.now() % 100000), { delay: 30 }); await p.waitForTimeout(1800);
o.partMenu = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); console.log('part menu', JSON.stringify(o.partMenu).slice(0, 300));
await p.keyboard.press('Enter'); await p.waitForTimeout(1200); console.log('after part', JSON.stringify(await state())); await s.shot('part');
await p.locator('[data-test-id="input_order_item_description"] textarea, [data-test-id="input_order_item_description"] input, textarea[data-test-id="input_order_item_description"]').first().fill('ZZAUTOTEST aging seed part');
await p.locator('[data-test-id="input_order_item_quantity"] input, input[data-test-id="input_order_item_quantity"]').first().fill('1');
await p.locator('[data-test-id="input_order_item_cost"] input, input[data-test-id="input_order_item_cost"]').first().fill('10');
o.catPicked = await sel('select_order_item_category', '');
await s.shot('filled');
await p.locator('[data-test-id="button_add_order_item"]').click(); await p.waitForTimeout(1500); await s.shot('added');
await p.locator('[data-test-id="button_save_and_close_order"]').click(); await p.waitForTimeout(4000); await s.shot('saved');
o.name = name; s.save('pocap', o); console.log(JSON.stringify({ vendorPicked: o.vendorPicked, catPicked: o.catPicked }), '\n', o.posts.map((x) => JSON.stringify(x).slice(0, 700)).join('\n'));
await s.close(); process.exit(0);
