// ui_create_invoice.mjs — drive the PRODUCT'S OWN "Create Invoice" button in the browser and capture
// the exact request it sends plus the exact response, so the ticket's claim about the on-screen path
// is confirmed or refuted from observation (Rule 12/13), not inferred from the API probe.
//
// Usage: node ui_create_invoice.mjs <workOrderId> [label]
import fs from 'fs';
import { boot, spaGo } from '../../../viu-2026-08-03/tools/boot8582.mjs';
import { APP } from '../../../viu-2026-08-03/tools/qa8582.mjs';

const woId = process.argv[2];
const label = process.argv[3] || 'ui';
const OUT = `/tmp/sv8821/ui-${label}`;
fs.mkdirSync(OUT, { recursive: true });

const { browser, page } = await boot('admin', { workplaceId: 'b3c8c820-f815-4cf1-8938-10956c5ee71a' });

// full request+response capture, bodies included — the netlog in boot() only keeps urls
const calls = [];
page.on('request', r => { if (r.url().includes('/api/')) calls.push({ t: Date.now(), phase: 'req', method: r.request?.().method?.() || r.method(), url: r.url(), body: r.postData() }); });
page.on('response', async r => {
  if (!r.url().includes('/api/')) return;
  let body = null; try { body = (await r.text()).slice(0, 1500); } catch {}
  const hdr = {}; try { const h = r.headers(); for (const k of ['x-request-id']) if (h[k]) hdr[k] = h[k]; } catch {}
  calls.push({ t: Date.now(), phase: 'res', status: r.status(), method: r.request().method(), url: r.url(), headers: hdr, body });
});

await page.goto(APP + `/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(6000);
console.log('url after goto:', page.url());
if (!page.url().includes(woId)) {   // the known "existing WO bounces" behaviour — retry in-SPA
  await spaGo(page, `/workorders/${woId}/lines`, 7000);
  console.log('url after spaGo:', page.url());
}
await page.screenshot({ path: `${OUT}/01-wo-lines.png`, fullPage: true });

// tabs
const tabs = await page.locator('[role="tab"], .q-tab').allInnerTexts().catch(() => []);
console.log('TABS:', JSON.stringify(tabs));

// click the Finance tab by its visible label, using an element-centre mouse click
// (Quasar backdrops make Playwright actionability clicks time out — Rule 14 self-seed playbook (e))
async function clickText(txt, timeout = 8000) {
  const el = page.locator(`text="${txt}"`).first();
  try {
    await el.waitFor({ state: 'visible', timeout });
    const b = await el.boundingBox();
    if (!b) return false;
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
    return true;
  } catch { return false; }
}
console.log('click Finance:', await clickText('Finance'));
await page.waitForTimeout(4000);
await page.screenshot({ path: `${OUT}/02-finance-tab.png`, fullPage: true });
const finText = await page.locator('body').innerText().catch(() => '');
fs.writeFileSync(`${OUT}/finance-tab.txt`, finText);
console.log('FINANCE TAB TEXT (first 1200):\n', finText.replace(/\n{2,}/g, '\n').slice(0, 1200));

// buttons present on the tab
const btns = await page.locator('button').allInnerTexts().catch(() => []);
console.log('BUTTONS:', JSON.stringify(btns.map(b => b.trim()).filter(Boolean)));

const mark = calls.length;
console.log('click Create Invoice:', await clickText('Create Invoice'));
await page.waitForTimeout(3000);
await page.screenshot({ path: `${OUT}/03-after-create-invoice-click.png`, fullPage: true });
// a confirm dialog may follow
const dlg = await page.locator('.q-dialog').innerText().catch(() => '');
if (dlg) {
  console.log('DIALOG:', dlg.replace(/\n+/g, ' | ').slice(0, 500));
  for (const w of ['Create Invoice', 'Confirm', 'Yes', 'Save', 'OK']) {
    if (await clickText(w, 2500)) { console.log('  dialog confirm clicked:', w); break; }
  }
  await page.waitForTimeout(4000);
}
await page.screenshot({ path: `${OUT}/04-final.png`, fullPage: true });
const finalText = await page.locator('body').innerText().catch(() => '');
fs.writeFileSync(`${OUT}/final.txt`, finalText);
console.log('\nON-SCREEN AFTER (first 1200):\n', finalText.replace(/\n{2,}/g, '\n').slice(0, 1200));

console.log('\n===== API CALLS AFTER THE CREATE-INVOICE CLICK =====');
for (const c of calls.slice(mark)) {
  const p = c.url.replace(/^https:\/\/[^/]+/, '');
  if (c.phase === 'req') console.log('  REQ ', c.method, p, c.body ? '\n        body: ' + String(c.body).slice(0, 400) : '');
  else console.log('  RES ', c.status, c.method, p, c.headers?.['x-request-id'] ? '| reqid ' + c.headers['x-request-id'] : '',
    c.status >= 400 ? '\n        body: ' + String(c.body).slice(0, 400) : '');
}
fs.writeFileSync(`${OUT}/calls.json`, JSON.stringify(calls, null, 1));
console.log('\nevidence:', OUT);
await browser.close();
