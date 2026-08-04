// ui_tab_state.mjs — read the DISABLED STATE and the on-screen REASON of the work order's Finance
// tab, for a work order with no contact vs one with a contact. This is what establishes whether the
// SV-8821 failure is reachable by a person clicking the product (Rule 51 reachability test).
// Usage: node ui_tab_state.mjs <woId> <label>
import fs from 'fs';
import { boot } from '../../../viu-2026-08-03/tools/boot8582.mjs';
import { APP } from '../../../viu-2026-08-03/tools/qa8582.mjs';
const woId = process.argv[2], label = process.argv[3] || 'tab';
const OUT = `/tmp/sv8821/ui-tabstate-${label}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot('admin', { workplaceId: 'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
await page.goto(APP + `/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(7000);

const tabs = await page.evaluate(() => [...document.querySelectorAll('[role="tab"]')].map(t => ({
  text: (t.innerText || '').trim().replace(/\s+/g, ' '),
  ariaDisabled: t.getAttribute('aria-disabled'),
  disabledClass: t.className.includes('disabled'),
  tabindex: t.getAttribute('tabindex'),
  opacity: getComputedStyle(t).opacity,
  pointerEvents: getComputedStyle(t).pointerEvents,
  color: getComputedStyle(t).color,
})));
console.log('=== TABS ===');
tabs.forEach(t => console.log('  ', t.text.padEnd(16), '| aria-disabled=' + t.ariaDisabled,
  '| disabledClass=' + t.disabledClass, '| tabindex=' + t.tabindex,
  '| opacity=' + t.opacity, '| pointer-events=' + t.pointerEvents, '| color=' + t.color));

// hover the Finance tab and read the tooltip the product shows
const fin = page.locator('[role="tab"]').filter({ hasText: 'Finance' }).first();
const b = await fin.boundingBox().catch(() => null);
if (b) {
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(2200);
  const tips = await page.locator('.q-tooltip, [role="tooltip"]').allInnerTexts().catch(() => []);
  console.log('\nTOOLTIP ON THE FINANCE TAB:', JSON.stringify(tips.map(t => t.trim()).filter(Boolean)));
  await page.screenshot({ path: `${OUT}/finance-tab-hover.png`, clip: { x: Math.max(0, b.x - 420), y: Math.max(0, b.y - 20), width: 900, height: 140 } });
  // then click it and report whether the panel actually changed
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(3500);
  const hasCreate = await page.locator('button').filter({ hasText: /Create Invoice/i }).count();
  const activeTab = await page.evaluate(() => {
    const a = [...document.querySelectorAll('[role="tab"]')].find(t => t.getAttribute('aria-selected') === 'true' || t.className.includes('q-tab--active'));
    return a ? (a.innerText || '').trim().replace(/\s+/g, ' ') : null;
  });
  console.log('after clicking Finance -> active tab is:', JSON.stringify(activeTab), '| "Create Invoice" buttons on screen:', hasCreate);
  await page.screenshot({ path: `${OUT}/after-click.png`, fullPage: true });
}
await browser.close();
console.log('evidence:', OUT);
