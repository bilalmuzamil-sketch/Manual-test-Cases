/**
 * 2x pictures for SV-11123 (C368216, part sale status card) and SV-11125 (C368221, Returns > Credits reload), 2026-10-10.
 * Fixes of caps2x: the Part Sales list's first <tr> is a hidden measuring row — open the sale by clicking its number text;
 * "Credits" is a text link in the page header, not a .q-tab — click it by its exact text inside the page (not the side menu).
 * Records the screen box (CSS px) of everything the annotation marks. Read-only apart from the date choice the case makes.
 */
import fs from 'node:fs'; import path from 'node:path';
import { open, APP } from './session.mts';
import { t } from './wob.mts';
const EV = process.env.WOB_EV as string;
const { browser, page: p } = await open('/parts/part-sales'); p.setDefaultTimeout(20_000); const R: any = {};
const box = async (l: any) => { const b = await l.boundingBox().catch(() => null); return b ? [b.x, b.y, b.width, b.height].map(Math.round) : null; };
const shot = (n: string) => p.screenshot({ path: path.join(EV, `${n}.png`), timeout: 20_000 }).catch(() => {});
const step = async (id: string, f: () => Promise<any>) => { try { R[id] = await f(); } catch (e: any) { R[id] = { error: String(e?.message || e).slice(0, 200) }; await shot(`pics2-${id}-error`); } console.log(t(), id, JSON.stringify(R[id]).slice(0, 600)); };
await step('C368216', async () => { await p.goto(`${APP}/parts/part-sales`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const num = p.getByText(/^\s*P10043-25[0-9]\s*$/).first(); const which = (await num.innerText()).trim(); await num.click(); await p.waitForTimeout(6000);
  for (let i = 0; i < 3 && await p.locator('.q-dialog').count(); i++) { await p.keyboard.press('Escape'); await p.waitForTimeout(800); }
  const lab = p.getByText(/^\s*Authorizer\s*$/).first(); const card = lab.locator('xpath=ancestor::div[contains(@class,"q-card")][1]');
  await shot('D16-C368216-raw'); return { sale: which, url: p.url().replace(APP, '').slice(0, 60), card: await box(card), text: (await card.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 220), dialogOpen: await p.locator('.q-dialog').count() }; });
await step('C368221', async () => { await p.goto(`${APP}/parts/returns`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const main = p.locator('main, .q-page').first(); await main.getByText('Credits', { exact: true }).first().click(); await p.waitForTimeout(3500);
  const chip = main.getByText(/^\s*Date:/).first(); const o: any = { credits: await box(main.getByText('Credits', { exact: true }).first()), returns: await box(main.getByText('Returns', { exact: true }).first()), chipBefore: (await chip.innerText().catch(() => '')).trim(), chip: await box(chip), urlBefore: p.url().replace(APP, ''), headBefore: (await p.locator('thead').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 80) };
  await shot('D18-C368221-before'); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const main2 = p.locator('main, .q-page').first(); o.urlAfter = p.url().replace(APP, ''); o.headAfter = (await p.locator('thead').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 80);
  o.chipAfter = (await main2.getByText(/^\s*Date:/).first().innerText().catch(() => '')).trim(); o.returns2 = await box(main2.getByText('Returns', { exact: true }).first()); o.credits2 = await box(main2.getByText('Credits', { exact: true }).first()); o.chip2 = await box(main2.getByText(/^\s*Date:/).first());
  o.activeColour = await p.evaluate(`(() => { const m = document.querySelector('main, .q-page') || document; return [...m.querySelectorAll('*')].filter(e => ['Returns','Credits'].includes((e.textContent||'').trim()) && e.children.length === 0).map(e => e.textContent.trim() + ':' + getComputedStyle(e).color).slice(0, 4); })()`);
  await shot('D18-C368221-after'); return o; });
fs.writeFileSync(path.join(EV, 'pics2.json'), JSON.stringify(R, null, 1));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
