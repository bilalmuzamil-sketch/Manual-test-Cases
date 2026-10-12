/** Read-only probe: opens Truck Hill 1's edit window, picks America/Edmonton, lists every button and its state, then closes WITHOUT saving. */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-12');
const { browser, page: p, APP } = await bootProdLogin('/administration/locations', { viewport: { width: 1600, height: 1000 } });
p.setDefaultTimeout(20000); const R = {};
try {
  await p.goto(`${APP}/administration/locations`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  await p.locator('tbody tr').filter({ hasText: 'Truck Hill 1' }).first().locator('text=edit_note').first().click(); await p.waitForTimeout(2500);
  const d = p.locator('.q-dialog').last(); const f = d.locator('.q-field').filter({ hasText: /Timezone/ }).first();
  await f.click(); await p.waitForTimeout(800); await p.keyboard.type('Edmonton', { delay: 60 }); await p.waitForTimeout(2000);
  await p.locator('.q-menu .q-item').filter({ hasText: 'America/Edmonton' }).first().click(); await p.waitForTimeout(1000);
  R.menusOpen = await p.locator('.q-menu').count();
  R.buttons = await p.evaluate(`[...document.querySelectorAll('button, [role=button], .q-btn')].filter(b => b.getBoundingClientRect().width > 0).map(b => ({ t: b.innerText.replace(/\\s+/g,' ').trim().slice(0,40), cls: b.className.slice(0,60), dis: b.disabled || b.getAttribute('aria-disabled'), tag: b.tagName, inDialog: !!b.closest('.q-dialog') }))`);
  await p.screenshot({ path: path.join(EV, 'tz-probe.png') });
} catch (e) { R.error = String(e).slice(0, 200); }
await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(500); await p.keyboard.press('Escape').catch(() => {});
await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
R.rowAfter = (await p.locator('tbody tr').filter({ hasText: 'Truck Hill 1' }).first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 120);
console.log('PROBE', JSON.stringify(R).slice(0, 4000)); await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
