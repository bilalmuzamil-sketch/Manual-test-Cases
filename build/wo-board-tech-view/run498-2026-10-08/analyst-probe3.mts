/** 16 Oct 2026 (batch 40) — Analyst 1 browser: signs in through the app's form if needed, then reads where it is (top bar, location
 *  menu offers, lead candidates). Picture EV/analyst-probe3.png. */
import fs from 'node:fs'; import path from 'node:path';
import { analystBrowser } from './analyst.mts'; import { EV, t } from './wob.mts';
const A = await analystBrowser('/workorders?tab=all'); const p = A.page, a = A.api; const o: any = { info: A.info };
o.cands = ((await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []).map((x: any) => `${x.firstName} ${x.lastName}`).slice(0, 30);
await p.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await p.waitForTimeout(1200); await p.locator('[data-test-id="select_location"]').click().catch(() => {}); await p.waitForTimeout(1500);
o.locMenu = (await p.locator('.q-menu .q-item').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 15); await p.screenshot({ path: path.join(EV, 'analyst-probe3.png') });
console.log(t(), 'ANALYST3', JSON.stringify(o).slice(0, 3000)); await A.browser.close(); process.exit(0);
