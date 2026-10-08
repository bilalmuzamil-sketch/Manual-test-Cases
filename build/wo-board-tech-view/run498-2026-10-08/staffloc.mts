/** Set a staff member's Location through their staff form (Settings > Staff > edit > Location > Save & Close). The
 *  list only offers the locations the person is enrolled at; picking another moves them off this one. (2026-10-08) */
import type { Page } from 'playwright';
import { APP } from './session.mts';
import { shot } from './wob.mts';
export async function setStaffLocation(p: Page, emailPart: string, loc: string) {
  const calls: string[] = []; const h = (q: any) => { if (q.method() !== 'GET' && /\/api\/(staff|iam)/.test(q.url())) calls.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '')} ${(q.postData() || '').slice(0, 300)}`); };
  p.on('request', h);
  try {
    await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
    await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(600);
    await p.locator('input[placeholder*="earch" i]:visible, input[data-test-id="page_search_input"]:visible').first().fill(emailPart); await p.waitForTimeout(3000);
    await p.locator('tr').filter({ hasText: emailPart }).first().locator('td').last().locator('button, [role=button], i, a').first().click(); await p.waitForTimeout(2500);
    const field = p.locator('.q-dialog .q-field').filter({ hasText: /^Location/ }).first();
    await field.click(); await p.waitForTimeout(1200);
    await p.locator('.q-menu .q-item, [role=option]').filter({ hasText: loc }).first().click(); await p.waitForTimeout(1000);
    await p.locator('.q-dialog').getByText('Edit Staff Member', { exact: true }).click().catch(() => {}); await p.waitForTimeout(800);
    const shown = (await field.innerText().catch(() => '')).replace(/\s+/g, ' ');
    await shot(p, `staffloc-${emailPart}-${loc.slice(8, 14)}`);
    const save = p.locator('button:visible').filter({ hasText: 'Save & Close' }).last();   // a hidden .q-dialog sits in front of the open one
    await save.click({ timeout: 10_000 }); await p.waitForTimeout(3500);
    return { shown, calls: [...calls], stillOpen: await p.locator('.q-dialog').count() };
  } finally { p.off('request', h); }
}
