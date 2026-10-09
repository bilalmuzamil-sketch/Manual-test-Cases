/** C96962 step 5 as the case words it (9 Oct 2026): "set Technicians to [Tech-C]" = REPLACE the line's technicians, not add
 *  one. Work order S10043-18751, Line 1 (Ralph Edwards + Dana Ortiz after the 17:25 check): in Edit Line remove both
 *  chips, add Esther Howard, Save & Close; read the line's history (API + the line menu > Audit log) before and after. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders');
const a = api(p); const R: any = {}; const W = '414a9680-4159-49da-b134-6f16efb5ad27';
const shot = (n: string) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const lines = async () => { const d = (await a.get(`/api/work-orders/lines/${W}`)).body?.data; return Array.isArray(d) ? d : d?.collection ?? []; };
const l0 = (await lines())[0]; const LID = l0.line_id ?? l0.id; R.lineName = l0.line_name ?? l0.name;
const hist = async () => { const r = (await a.get(`/api/work-orders/lines/${LID}/history`)).body?.data; const h = Array.isArray(r) ? r : r?.collection ?? []; return h.map((e: any) => `${e.eventName ?? e.event ?? ''} | ${JSON.stringify(e.details ?? e.changes ?? e.description ?? '').slice(0, 120)}`); };
R.before = await hist();
await p.goto(`${APP}/workorders/${W}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
await p.getByText(R.lineName, { exact: false }).first().click(); await p.waitForTimeout(2500); const dlg = p.locator('.q-dialog').last();
R.chipsBefore = (await dlg.locator('.q-chip').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim());
for (const who of ['Ralph Edwards', 'Dana Ortiz']) { const c = dlg.locator('.q-chip').filter({ hasText: who }).first(); if (await c.count()) { await c.locator('.q-chip__icon--remove, i').last().click(); await p.waitForTimeout(600); } }
const fld = dlg.locator('[data-test-id="select_line_roster_add_technician"]').or(dlg.locator('.q-field').filter({ hasText: /Add Technician/i })).first(); await fld.click(); await p.waitForTimeout(800); await p.keyboard.type('Esther', { delay: 40 }); await p.waitForTimeout(1500);
const opt = p.locator('.q-menu .q-item').filter({ hasText: 'Esther Howard' }).first(); R.option = await opt.count(); if (R.option) await opt.click(); await p.waitForTimeout(800);
await dlg.locator('.text-h6').first().click().catch(() => {}); R.chipsSet = (await dlg.locator('.q-chip').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim()); await shot('D8r-edit-line-replaced');
await dlg.locator('button').filter({ hasText: /Save & Close/i }).last().click(); await p.waitForTimeout(4500);
const l1 = (await lines())[0]; R.techsAfter = (l1?.tasks ?? l1?.technicians ?? []).map((x: any) => x.name ?? `${x.first_name ?? ''} ${x.last_name ?? ''}`.trim());
R.after = await hist(); R.newEntries = R.after.slice(0, R.after.length - R.before.length);
await p.locator(`[data-test-id="line_number_${LID}"]`).click().catch(() => {}); await p.waitForTimeout(1200);
const al = p.locator('.q-menu .q-item').filter({ hasText: /Audit log/i }).first(); if (await al.count()) { await al.click(); await p.waitForTimeout(3000); R.auditText = (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 700); await shot('D8r-line-audit-log'); }
fs.writeFileSync(path.join(EV, 'd8-replace.json'), JSON.stringify(R, null, 1)); console.log(t(), JSON.stringify(R, null, 1)); await done(browser);
