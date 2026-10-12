/** Production (12 Oct 2026): read the Locations settings and the current location's time-zone field. Read-only. */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-12'); fs.mkdirSync(EV, { recursive: true });
const R = {}; const { browser, page: p, APP } = await bootProdLogin('/administration/locations', { viewport: { width: 1600, height: 1000 } });
p.setDefaultTimeout(20000);
try { await p.waitForTimeout(8000); R.url = p.url().replace(APP, ''); R.rows = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 140)).slice(0, 10)`);
  R.top = (await p.locator('header').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(-60); await p.screenshot({ path: path.join(EV, 'locations.png') });
  const row = p.locator('tbody tr').filter({ hasText: 'Truck Hill 1' }).first(); R.rowText = (await row.innerText()).replace(/\s+/g, ' ').slice(0, 100); const btns = await row.locator('button').count(); R.rowButtons = await row.evaluate((r) => [...r.querySelectorAll('button')].map((b) => (b.getAttribute('data-test-id') || '') + '|' + b.innerText.trim()));
  await row.locator('text=edit_note').first().click().catch(async () => { await row.locator('i, .q-icon').filter({ hasText: 'edit_note' }).first().click().catch(() => {}); }); await p.waitForTimeout(3000); R.afterClick = p.url().replace(APP, '');
  R.dialog = (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900); R.buttons = await p.locator('.q-dialog button').allInnerTexts().catch(() => []);
  R.labels = await p.evaluate(`[...document.querySelectorAll('.q-field__label, label')].map(e => e.innerText.trim()).filter(Boolean).slice(0, 40)`);
  R.tzFields = await p.evaluate(`[...document.querySelectorAll('.q-field')].filter(f => /time ?zone|Africa|America|UTC/i.test(f.innerText)).map(f => f.innerText.replace(/\\s+/g, ' ').slice(0, 120))`);
  await p.screenshot({ path: path.join(EV, 'location-edit2.png') });
} catch (e) { R.error = String(e?.message || e).slice(0, 200); }
console.log('LOC', JSON.stringify(R).slice(0, 3000)); fs.writeFileSync(path.join(EV, 'prod-loc-look2.json'), JSON.stringify(R, null, 1));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
