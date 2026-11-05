// sv11822_staging_dpr.mjs — SV-11822 on STAGING, Mudassir's comment 80176 set-up: viewport 1536x936, devicePixelRatio 1.25,
// plain load / reload with the given active location → Profile → click the location chip. Staging only (quick-login is allowed there).
// Usage: TZ=<browser zone> node sv11822_staging_dpr.mjs <QB|HD|DVI|LB> [dpr]
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05/SV-11822-retest';
const APP = 'https://app.staging.shopview.com';
const L = { QB: { id: '25a0d576-b371-4b82-bef4-41ba977f31c2', name: 'QB Location', tz: 'America/Vancouver' },
  HD: { id: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', name: 'Staging Heavy Duty - 9919', tz: 'Asia/Karachi' },
  LB: { id: 'f8a8b802-7780-4b16-bf10-343caeb616b2', name: 'Staging Lethbridge - 4310', tz: 'America/Edmonton' },
  DVI: { id: '39522bc6-abca-4f67-bd12-2840043c2d68', name: 'DVI Test', tz: 'Pacific/Fiji' } };
const which = process.argv[2], dpr = +(process.argv[3] || 1.25), W = 1536, H = 936; const TGT = L[which]; const BTZ = process.env.TZ;
const tag = `staging-${which}-dpr${dpr}-${BTZ.replace('/', '_')}`; const sleep = ms => new Promise(r => setTimeout(r, ms));
const { browser, page } = await boot2('admin', { workplaceId: TGT.id, timezone: TGT.tz, contextOptions: { viewport: { width: W, height: H }, deviceScaleFactor: dpr, timezoneId: BTZ } });
await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [TGT.id, TGT.tz]);
const menuState = () => page.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')]; const m = ms.find(x => x.querySelector('[data-test-id^="option_item_"]')) || ms[ms.length - 1];
  if (!m) return { menu_found: false, n_menus: ms.length }; const r = m.getBoundingClientRect(); const cs = getComputedStyle(m);
  return { menu_found: true, classes: m.className, inline_style: m.getAttribute('style'), rect: { top: +r.top.toFixed(2), left: +r.left.toFixed(2), width: +r.width.toFixed(2), height: +r.height.toFixed(2) },
    computed_visibility: cs.visibility, on_screen: r.height > 0 && r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1 && cs.visibility === 'visible',
    viewport: [innerWidth, innerHeight], dpr: devicePixelRatio, option_items: [...m.querySelectorAll('[data-test-id^="option_item_"]')].map(o => o.innerText.replace(/check\s*/, '').trim()) }; });
const zone = () => page.evaluate(() => ({ browser_timezoneId: Intl.DateTimeFormat().resolvedOptions().timeZone, localStorage_timezone: localStorage.getItem('timezone'), localStorage_location: localStorage.getItem('location'), header: (document.querySelector('header, .q-header')?.innerText || '').replace(/\s+/g, ' ').slice(0, 300) }));
const E = { ticket: 'SV-11822', env: 'staging', tag, viewport: [W, H], deviceScaleFactor: dpr, target: TGT, browser_tz: BTZ, process_TZ: BTZ, rule99_match: BTZ === TGT.tz, checks: [] };
for (const [i, path] of ['/dashboard', '/workorders', '/dashboard'].entries()) {
  await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); if (i === 2) { await sleep(3000); await page.reload({ waitUntil: 'domcontentloaded' }); }
  await sleep(10000); if (!E.app_version) E.app_version = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
  await page.locator('[data-test-id="profile_menu_button"]').click(); await sleep(1200); await page.locator('[data-test-id="select_location"]').click(); await sleep(1800);
  const st = await menuState(); st.load = i === 2 ? 'reload' : 'plain load'; st.path = path; st.zone = await zone(); st.at_utc = new Date().toISOString();
  st.picture = `SV-11822-retest/${tag}-${i}.png`; await page.screenshot({ path: `${OUT}/${tag}-${i}.png` }); E.checks.push(st);
  console.log(tag, E.app_version, st.load, path, JSON.stringify({ on: st.on_screen, vis: st.computed_visibility, rect: st.rect, n: st.option_items?.length, hdr: st.zone.header.includes(TGT.name) }));
  for (let k = 0; k < 2; k++) { await page.keyboard.press('Escape'); await sleep(400); }
}
fs.writeFileSync(`${OUT}/evidence-${tag}.json`, JSON.stringify(E, null, 1)); await browser.close();
