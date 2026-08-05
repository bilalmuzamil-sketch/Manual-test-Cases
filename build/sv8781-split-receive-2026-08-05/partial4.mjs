import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pw;
const APP = 'https://sv8781.qa.shopview.com', API = 'https://sv8781api.qa.shopview.com';
const PO = '8b6dd6f9-6cf5-48d7-a3b3-11e1909e62f0', NEW = 'a6c4f265-5ca7-48da-8c73-f7ba8b1088b6', LINE = 'de58b8bb-e787-48f9-b799-c42e615ed44a', VEND = '1e7bd0bf-e882-45fa-8c21-835e32ffa374';
const P1 = 'd9c448ac-8260-495c-93a7-d8f175746cb9'; // ZZAUTOTEST part 1, qty 2  -> RECEIVE
const P2 = '8fbd418b-b260-4cef-9ebd-41bd604c20dc'; // ZZAUTOTEST part 2, qty 1  -> LEAVE BEHIND
const PORT = fs.readFileSync('/tmp/sv8781/bridge.log', 'utf8').match(/BRIDGE_LISTENING 127\.0\.0\.1:(\d+)/)[1];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: 'http://127.0.0.1:' + PORT }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ storageState: '/tmp/sv8781/state.json', viewport: { width: 1600, height: 1100 }, ignoreHTTPSErrors: true });
const p = await ctx.newPage();
const posts = [];
p.on('response', async r => { if (r.url().includes('/api/') && r.request().method() === 'POST') { let b = ''; try { b = (await r.text()).slice(0, 300); } catch {} posts.push(`${r.status()} ${r.url().split('sv8781api.qa.shopview.com')[1]} >> ${b}`); } });
const BTN = `[data-test-id="button_receive_po_${PO}"]`;
const dis = () => p.evaluate(s => document.querySelector(s)?.disabled, BTN);
const tip = async () => { const b = await p.locator(BTN).boundingBox(); await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await p.waitForTimeout(1500); return (await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).join(' | ') || '(none)'; };
const setNum = async (tid, v) => { const l = p.locator(`[data-test-id="${tid}"]`); await l.click(); await l.fill(''); await l.type(v, { delay: 40 }); await p.keyboard.press('Tab'); await p.waitForTimeout(700); };

await p.goto(`${APP}/order/${PO}?receive=1&workOrderId=${NEW}&returnTo=WorkOrder&returnId=${NEW}&returnLineId=${LINE}&vendorIds=${VEND}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(12000);

await setNum(`input_invoice_${PO}`, 'ZZAUTOTEST-INV-1');
// part 1 gets a real cost + sell
await setNum(`input_cost_${P1}`, '25.50');
await setNum(`input_sell_${P1}`, '40.00');
// leave part 2 behind: uncheck it (click the checkbox wrapper, the input itself is hidden)
await p.locator(`[data-test-id="checkbox_item_${P2}"]`).click({ force: true, timeout: 8000 }).catch(async () => {
  await p.evaluate(id => document.querySelector(`[data-test-id="checkbox_item_${id}"]`)?.closest('.q-checkbox')?.click(), P2);
});
await p.waitForTimeout(2000);
const st = await p.evaluate(({ P1, P2 }) => ({
  p1checked: document.querySelector(`[data-test-id="checkbox_item_${P1}"]`)?.checked,
  p2checked: document.querySelector(`[data-test-id="checkbox_item_${P2}"]`)?.checked,
  p1cost: document.querySelector(`[data-test-id="input_cost_${P1}"]`)?.value,
  p1sell: document.querySelector(`[data-test-id="input_sell_${P1}"]`)?.value,
  p1qty: document.querySelector(`[data-test-id="input_qty_${P1}"]`)?.value,
  inv: document.querySelector(`[data-test-id^="input_invoice_"]`)?.value,
}), { P1, P2 });
console.log('form state:', JSON.stringify(st));
console.log('disabled:', await dis(), '| tooltip:', await tip());
await p.screenshot({ path: '/tmp/sv8781/partial4-before.png' });

if (!(await dis())) {
  console.log('\n>>> RECEIVING only ZZAUTOTEST part 1 (qty 2), leaving part 2 behind');
  await p.locator(BTN).click({ timeout: 10000 });
  await p.waitForTimeout(15000);
  console.log('url after:', p.url());
  posts.forEach(x => console.log('  POST ' + x));
  await p.screenshot({ path: '/tmp/sv8781/partial4-after.png' });
} else console.log('\nSTILL DISABLED');
await browser.close();
