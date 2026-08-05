// Receive BOTH items (spanning two POs) in ONE submission under ONE invoice number,
// then verify each posts against its OWN purchase order - not double-counted, not missing.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pw;
const APP = 'https://sv8781.qa.shopview.com', API = 'https://sv8781api.qa.shopview.com';
const WOA = '4be9c3df-50c7-4ba0-91ba-4a1c7d6432b0', WOB = '41309809-1312-495f-92b0-c551c3e44d61';
const POB = 'a6e4bc4b-b381-43f5-9e52-98b175afca02', POA = '5ea83031-a32e-408a-b2dc-a7083989f4cb';
const PORT = fs.readFileSync('/tmp/sv8781/bridge.log', 'utf8').match(/BRIDGE_LISTENING 127\.0\.0\.1:(\d+)/)[1];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: 'http://127.0.0.1:' + PORT }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ storageState: '/tmp/sv8781/state.json', viewport: { width: 1600, height: 1150 }, ignoreHTTPSErrors: true });
const p = await ctx.newPage();
const posts = [];
p.on('response', async r => { if (r.url().includes('sv8781api') && r.request().method() === 'POST') { let b = ''; try { b = (await r.text()).slice(0, 200); } catch {} posts.push(`${r.status()} ${r.url().split('sv8781api.qa.shopview.com')[1]?.split('?')[0]} >> ${b}`); } });
const api = (m, path, b) => p.evaluate(async ({ API, m, path, b }) => { const r = await fetch(API + path, { method: m, credentials: 'include', headers: b ? { 'Content-Type': 'application/json' } : undefined, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {} return { status: r.status, json: j }; }, { API, m, path, b });

await p.goto(`${APP}/order/${POB}?receive=1&workOrderId=${WOB}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(13000);
const setNum = async (tid, v) => { const l = p.locator(`[data-test-id="${tid}"]`); await l.click(); await l.fill(''); await l.type(v, { delay: 40 }); await p.keyboard.press('Tab'); await p.waitForTimeout(600); };
await setNum(`input_invoice_${POB}`, 'ZZAUTOTEST-INV-MERGED');
await p.waitForTimeout(800);
const BTN = `[data-test-id="button_receive_po_${POB}"]`;
const dis = await p.evaluate(s => document.querySelector(s)?.disabled, BTN);
console.log('receive button disabled:', dis);
if (dis) { const b = await p.locator(BTN).boundingBox(); await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await p.waitForTimeout(1500); console.log('tooltip:', (await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).join(' | ')); }
await p.screenshot({ path: '/tmp/sv8781/key-receive-before.png' });
if (!dis) {
  await p.locator(BTN).click({ timeout: 10000 });
  await p.waitForTimeout(15000);
  console.log('\nPOST calls:'); posts.forEach(x => console.log('  ' + x));
}
await p.screenshot({ path: '/tmp/sv8781/key-receive-after.png' });

// ---- verify each PO posted its own item ----
for (const [tag, id] of [['PO-A S-15888 (original WO)', POA], ['PO-B S-15889 (new WO)', POB]]) {
  const o = await api('GET', `/api/inventory/orders/${id}`);
  const d = o.json?.data?.order || o.json?.data || {};
  console.log(`\n[${tag}] status=${d.status} total=$${d.total_price}`);
  for (const it of (d.items || [])) console.log(`   ${it.description} | qty=${it.quantity} | cost=${it.cost} | received=${it.quantity_received ?? it.received ?? '?'} | remaining=${it.quantity_remaining ?? '?'}`);
}
// receive views should now be empty / reduced
for (const [tag, id] of [['WO-A', WOA], ['WO-B', WOB]]) {
  const rv = await api('POST', '/api/inventory/orders/receive-view', { workOrderId: id });
  const vs = rv.json?.data?.vendors || [];
  const items = vs.flatMap(v => v.purchaseOrders.flatMap(po => (po.items || []).map(i => `${i.description}(rem ${i.quantityRemaining}, ${i.orderNumber})`)));
  console.log(`\n[${tag}] still awaiting receipt: ${items.length ? items.join(', ') : 'NOTHING'}`);
}
await browser.close();
