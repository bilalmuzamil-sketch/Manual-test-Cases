// Add two lines to the work order through the New Line dialog (the UI path that works).
import { open } from '/tmp/sv8781/api.mjs';
const WO = '4be9c3df-50c7-4ba0-91ba-4a1c7d6432b0';
const WANT = ['5th wheel adjustment', 'Steer hub oil'];
const s = await open();
const p = s.page;

for (const want of WANT) {
  await p.goto(s.APP + `/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(9000);
  if (!(await p.locator('[data-test-id="dialog_line"]').count())) {
    await p.locator('[data-test-id="button_new_line"]').click({ timeout: 12000 });
    await p.waitForTimeout(3000);
  }
  await p.locator('[data-test-id="select_line_canned_line"]').click({ timeout: 10000 });
  await p.waitForTimeout(1800);
  const item = p.locator('.q-menu .q-item').filter({ hasText: want }).first();
  const label = (await item.innerText().catch(() => '')).replace(/\n/g, ' ').trim();
  await item.click({ timeout: 10000 });
  console.log(`selected: "${label.slice(0, 60)}"`);
  await p.waitForTimeout(3000);
  const ap = p.locator('[data-test-id="checkbox_line_approved"]').first();
  if (await ap.count()) { await ap.click({ timeout: 6000 }).catch(() => {}); }
  await p.waitForTimeout(600);
  await p.locator('[data-test-id="button_save_close"]').click({ timeout: 12000 });
  await p.waitForTimeout(9000);
  console.log('  saved');
}

const lr = await s.api('GET', `/api/work-orders/lines/${WO}`);
const coll = lr.json.data.collection || lr.json.data;
console.log('\nLINES ON WO:', coll.length);
for (const l of coll) console.log(`  ${l.line_id} "${(l.line_name || '').trim()}" est=${l.time_estimate} rate=${l.labour_rate}`);
console.log('\nLINE_IDS=' + coll.map(l => l.line_id).join(','));
await p.screenshot({ path: '/tmp/sv8781/two-lines.png' });
await s.browser.close();
