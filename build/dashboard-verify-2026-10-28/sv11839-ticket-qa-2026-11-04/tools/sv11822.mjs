// sv11822.mjs — SV-11822 location chip after reload. "DVI Test" does not exist on sv11839 (GET /api/staff/my-workplaces lists only
// Staging Heavy Duty - 9919, Staging Lethbridge - 4310, Test Location), so the closest faithful equivalents are run:
//   A (TZ=America/Edmonton): start at Heavy Duty → Profile → Change Location → Staging Lethbridge - 4310 → reload on Dashboard, Reports > Sales,
//     Customers, Work Orders → Profile → click the location chip → list must open on screen with every location → switch back to Heavy Duty.
//   B (TZ=Asia/Karachi): Test Location selected (set at sign-in, the zone-matched way) → reload → Profile → chip → list opens.
// SECRET-FREE. Usage: node sv11822.mjs A|B
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP, OUT } from './common.mjs';
const run = process.argv[2]; const T = 'SV-11822';
const startLoc = run === 'A' ? LOC.HD : LOC.TL;
const { browser, page, rule99, app_version } = await boot(startLoc);
const P = { run, app_version, rule99_start: rule99, steps: [] };
const openChip = async label => {
  await page.locator('[data-test-id="profile_menu_button"]').click(); await sleep(1200);
  await page.locator('[data-test-id="select_location"]').click(); await sleep(1500);
  const st = await page.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')]; const m = ms.find(x => x.querySelector('[data-test-id^="option_item_"]')) || ms[ms.length - 1];
    if (!m) return { menu: null }; const r = m.getBoundingClientRect(); const cs = getComputedStyle(m);
    return { menu: { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height), visibility: cs.visibility, inline_top: m.style.top, inline_left: m.style.left },
      on_screen: r.height > 0 && r.top >= 0 && r.bottom <= innerHeight + 1 && cs.visibility === 'visible', viewport: [innerWidth, innerHeight],
      options: [...m.querySelectorAll('[data-test-id^="option_item_"]')].map(o => o.innerText.trim()), chip: document.querySelector('[data-test-id="select_location"]')?.innerText.replace(/\s+/g, ' ').trim() }; });
  st.picture = await shot(page, T, `${run}-${label}`); return st;
};
const pick = async name => { await page.locator('.q-menu [data-test-id^="option_item_"]').filter({ hasText: name }).first().click(); await sleep(7000); };
const headerLoc = async () => page.evaluate(() => document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.replace(/\s+/g, ' ').trim());
if (run === 'A') {
  P.steps.push({ step: '2 open chip before switching', ...(await openChip('1-chip-before-switch')) });
  await pick('Staging Lethbridge - 4310');
  P.steps.push({ step: '2 switched to Lethbridge', header: await headerLoc(), ls: await page.evaluate(() => [localStorage.getItem('location'), localStorage.getItem('timezone')]) });
  const pages = [['dashboard', '/dashboard'], ['reports-sales', '/reports/sales'], ['customers', '/customers'], ['work-orders', '/workorders']];
  for (let n = 0; n < pages.length; n++) {
    const [name, path] = pages[n];
    await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(3000); await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(9000);
    const st = await openChip(`${2 + n}-after-reload-${name}`); st.header = await headerLoc(); st.page = name;
    P.steps.push({ step: `3-4 reload on ${name} then click chip`, ...st }); await page.keyboard.press('Escape'); await sleep(500); await page.keyboard.press('Escape'); await sleep(500);
  }
  // Backspace on the chip must not blank the location (developer's hardening note)
  await page.locator('[data-test-id="profile_menu_button"]').click(); await sleep(1000);
  const chip = page.locator('[data-test-id="select_location"]'); await chip.focus().catch(() => {}); await page.keyboard.press('Backspace'); await sleep(1500);
  P.backspace = { chip_after: await chip.innerText().catch(() => null), ls_location: await page.evaluate(() => localStorage.getItem('location')) }; await page.keyboard.press('Escape'); await sleep(800);
  const back = await openChip('7-chip-before-switch-back'); await pick('Staging Heavy Duty - 9919');
  await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(9000);
  P.steps.push({ step: 'switched back to Heavy Duty and reloaded', options_seen: back.options, header: await headerLoc(), ls: await page.evaluate(() => [localStorage.getItem('location'), localStorage.getItem('timezone')]) });
  P.rule99_end = await finish(page, LOC.HD, rule99);
} else {
  await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(9000);
  const st = await openChip('1-test-location-after-reload'); st.header = await headerLoc(); P.steps.push({ step: 'reload at Test Location then click chip', ...st });
  await page.keyboard.press('Escape'); await sleep(500); await page.keyboard.press('Escape'); await sleep(500);
  P.rule99_end = await finish(page, LOC.TL, rule99);
}
const f = `${OUT}/${T}/evidence-${run}.json`; fs.mkdirSync(`${OUT}/${T}`, { recursive: true }); fs.writeFileSync(f, JSON.stringify({ ticket: T, ...P }, null, 1));
for (const s of P.steps) console.log(s.step, '|', JSON.stringify({ on: s.on_screen, menu: s.menu, opts: s.options, chip: s.chip, header: s.header, ls: s.ls }));
console.log('backspace', JSON.stringify(P.backspace), 'RULE99', P.rule99_end.all_match);
await browser.close();
