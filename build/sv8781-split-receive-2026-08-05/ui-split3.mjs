// "Split work order" is a CLICK-TWICE-TO-CONFIRM control (guard: first call arms, second acts).
// Split line 1 — the line holding the PARTIALLY RECEIVED part — through the UI.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pw;
const APP = 'https://sv8781.qa.shopview.com', API = 'https://sv8781api.qa.shopview.com';
const WO = '4be9c3df-50c7-4ba0-91ba-4a1c7d6432b0', L1 = '29f728aa-1fad-4af2-bd96-4b6d6a739504';
const PORT = fs.readFileSync('/tmp/sv8781/bridge.log', 'utf8').match(/BRIDGE_LISTENING 127\.0\.0\.1:(\d+)/)[1];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: 'http://127.0.0.1:' + PORT }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ storageState: '/tmp/sv8781/state.json', viewport: { width: 1600, height: 1100 }, ignoreHTTPSErrors: true });
const p = await ctx.newPage();
const net = [];
p.on('response', r => { const u = r.url(); if (u.includes('sv8781api') && r.request().method() !== 'GET') net.push(`${r.status()} ${r.request().method()} ${u.split('sv8781api.qa.shopview.com')[1]?.split('?')[0]}`); });
const api = (m, path, b) => p.evaluate(async ({ API, m, path, b }) => { const r = await fetch(API + path, { method: m, credentials: 'include', headers: b ? { 'Content-Type': 'application/json' } : undefined, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {} return { status: r.status, json: j }; }, { API, m, path, b });

await p.goto(APP + `/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(11000);
await p.locator(`[data-test-id="line_number_${L1}"]`).first().hover({ timeout: 8000 }).catch(() => {});
await p.waitForTimeout(700);
await p.locator(`[data-test-id="line_checkbox_${L1}"]`).click({ timeout: 8000 });
await p.waitForTimeout(1400);

const clickSplit = async (n) => {
  await p.locator('[data-test-id="button_line_bulk_action"]').click({ timeout: 10000 });
  await p.waitForTimeout(2000);
  const item = p.locator('.q-menu .q-item').filter({ hasText: /split/i }).first();
  const label = (await item.innerText().catch(() => '')).trim();
  const box = await item.boundingBox();
  console.log(`click ${n}: menu item label = ${JSON.stringify(label)}`);
  await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await p.waitForTimeout(2500);
};
// also capture the bulk-action button's own label, which flips to the confirm style
const btnLabel = async () => (await p.locator('[data-test-id="button_line_bulk_action"]').innerText().catch(() => '')).trim();
console.log('bulk button before:', JSON.stringify(await btnLabel()));
await clickSplit(1);
console.log('bulk button after 1st:', JSON.stringify(await btnLabel()));
await p.screenshot({ path: '/tmp/sv8781/split3-armed.png' });
await clickSplit(2);
await p.waitForTimeout(14000);

console.log('\napi writes:', net.join(' | ') || '(none)');
console.log('url now:', p.url());
console.log('toasts:', JSON.stringify(await p.locator('.q-notification').allInnerTexts().catch(() => [])));
await p.screenshot({ path: '/tmp/sv8781/split3-after.png' });

const newWo = (p.url().match(/workorders\/([0-9a-f-]{36})/) || [])[1];
console.log('WO in url:', newWo, newWo === WO ? '(UNCHANGED)' : '(NEW WORK ORDER)');
const show = async (tag, woId) => {
  const rv = await api('POST', '/api/inventory/orders/receive-view', { workOrderId: woId });
  const vs = rv.json?.data?.vendors || [];
  console.log(`\n[${tag}] vendor blocks: ${vs.length}`);
  for (const v of vs) { console.log(`   vendor="${v.vendorName}"  POs MERGED INTO THIS BLOCK: ${v.purchaseOrders.length}`); for (const po of v.purchaseOrders) { console.log(`     PO ${po.orderNumber} items=${(po.items || []).length}`); for (const it of (po.items || [])) console.log(`        ${it.description}  ordered=${it.quantityOrdered ?? it.quantity} remaining=${it.quantityRemaining} orderNumber=${it.orderNumber}`); } }
};
await show('WO-A (original)', WO);
if (newWo && newWo !== WO) await show('WO-B (new, from split)', newWo);
const list = await api('GET', '/api/inventory/orders?limit=25');
console.log('\nPOs:');
for (const o of (list.json?.data?.collection || []).filter(o => o.workOrderId === WO || o.workOrderId === newWo)) console.log(`   ${o.order_number} wo=${o.workOrderId === WO ? 'A(original)' : 'B(new)'} status=${o.status} vendors=${JSON.stringify(o.vendorNames)}`);
fs.writeFileSync('/tmp/sv8781/ids-final.json', JSON.stringify({ WO, newWo }));
await browser.close();
