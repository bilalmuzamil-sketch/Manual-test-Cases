// capture_techstory_endpoint.mjs — learn the endpoint the UI uses to save a line's TECH STORY, and
// the endpoint it uses to COMPLETE a line, by driving the real controls and logging the requests.
// Needed because POST /api/work-orders/lines/change returns HTTP 500 on this branch.
// SECRET-FREE. Usage: node capture_techstory_endpoint.mjs <workOrderId>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl } from './reportlib.mjs';

const woId = process.argv[2];
const OUT = new URL('../evidence/seeding/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const L = (...a) => console.log(...a);
const { browser, page, ctx } = await boot('admin');

// log request BODIES too, not just urls
const reqs = [];
page.on('request', r => {
  if (!r.url().includes('/api/')) return;
  reqs.push({ method: r.method(), url: r.url().replace(/^https:\/\/[^/]+/, ''), body: (r.postData() || '').slice(0, 700) });
});
page.on('response', async r => {
  if (!r.url().includes('/api/')) return;
  const m = reqs.find(x => x.url === r.url().replace(/^https:\/\/[^/]+/, '') && x.status === undefined);
  if (m) m.status = r.status();
});

await page.goto(`${APP}/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(11000);

// the tech-story field renders as "Add tech story for this line"
const storyEl = page.locator('text=Add tech story for this line').first();
L('tech story placeholder present:', await storyEl.count());
if (await storyEl.count()) {
  await clickEl(page, storyEl, 2200);
  await page.screenshot({ path: OUT + 'techstory-open.png', fullPage: true });
  const before = reqs.length;
  await page.keyboard.type('ZZAUTOTEST VIU seed story', { delay: 40 });
  await page.waitForTimeout(1200);
  // blur to save-on-change, then also try an explicit Save
  await page.mouse.click(20, 20);
  await page.waitForTimeout(5000);
  const save = page.locator('button, .q-btn').filter({ hasText: /^Save$/i }).first();
  if (await save.count()) { await clickEl(page, save, 5000); L('clicked an explicit Save'); }
  L('TECH STORY REQUESTS:');
  for (const r of reqs.slice(before)) L('  ', r.status, r.method, r.url.slice(0, 120), '|', r.body.slice(0, 320));
  await page.screenshot({ path: OUT + 'techstory-saved.png', fullPage: true });
}

// now the line's "Complete" action
{
  const before = reqs.length;
  const comp = page.locator('table button, table .q-btn, .q-btn').filter({ hasText: /^Complete$/ }).first();
  L('line Complete button present:', await comp.count());
  if (await comp.count()) {
    await clickEl(page, comp, 6000);
    // a confirm dialog may appear
    const conf = page.locator('.q-dialog .q-btn').filter({ hasText: /^(Complete|Yes|Confirm|OK)$/i }).first();
    if (await conf.count()) { await clickEl(page, conf, 6000); L('confirmed the dialog'); }
    L('COMPLETE REQUESTS:');
    for (const r of reqs.slice(before)) L('  ', r.status, r.method, r.url.slice(0, 120), '|', r.body.slice(0, 300));
    await page.screenshot({ path: OUT + 'line-completed.png', fullPage: true });
  }
}
fs.writeFileSync(OUT + 'techstory-requests.json', JSON.stringify(reqs, null, 1));
const body = await page.locator('body').innerText().catch(() => '');
L('tail:', body.slice(-600).replace(/\n+/g, ' | '));
await browser.close();
