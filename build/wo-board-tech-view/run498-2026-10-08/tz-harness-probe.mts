/** 12 Oct 2026 — is the six-hour offset the HARNESS? The sign-in helper injects the login response as localStorage 'user'
 *  before every page load. Read what the app sees, then open the same Timesheets row twice: as the harness leaves it, and
 *  with details.workplace_timezone = America/Edmonton injected after it (init scripts run in order). Read-only on the app. */
import fs from 'fs'; import path from 'path';
import { open, APP } from './session.mts';
import { api, workOrders } from './data.mts';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'tz-harness-2026-10-12'); fs.mkdirSync(EV, { recursive: true });
const R: any = {}; const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const seen = () => p.evaluate(() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); const d = u.data ?? u; return { wtz: d?.details?.workplace_timezone ?? null, tz: d?.timezone ?? d?.details?.timezone ?? null, keys: Object.keys(d?.details ?? {}).filter((k) => /zone|tz|work/i.test(k)) }; } catch (e) { return String(e); } });
R.injected = await seen(); R.browserTZ = await p.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
const w = (await workOrders(a, 'S10043-19185'))[0]; R.wo = w?.number ?? w?.id;
const readRow = async (tag: string) => {
  await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({ hasText: /Timesheets/ }).first().click(); await p.waitForTimeout(4000);
  await p.screenshot({ path: path.join(EV, `${tag}.png`) });
  return (await p.locator('tr').filter({ hasText: /Esther/ }).allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').slice(0, 120));
};
R.shopNow = new Date().toLocaleString('en-US', { timeZone: 'America/Edmonton' }); R.utcNow = new Date().toISOString();
R.asHarness = await readRow('as-harness');
await p.context().addInitScript(() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); const d = u.data ?? u; d.details = { ...(d.details || {}), workplace_timezone: 'America/Edmonton' }; localStorage.setItem('user', JSON.stringify(u.data ? { data: d } : d)); } catch {} });
R.fixedSeen = await (async () => { await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000); return seen(); })();
R.withShopZone = await readRow('with-shop-zone');
fs.writeFileSync(path.join(EV, 'probe.json'), JSON.stringify(R, null, 1)); console.log('TZPROBE', JSON.stringify(R));
await browser.close(); process.exit(0);
