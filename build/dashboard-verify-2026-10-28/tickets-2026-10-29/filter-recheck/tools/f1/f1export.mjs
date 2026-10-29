// Copied from phase2/tools/p2a/modes.mjs exportPayroll (proven); changed: range null keeps the dialog's default; records the dialog default and the range options. SECRET-FREE.
export async function exportPayroll(c, { range, from, to, shotName }) {
  const { page, meta, shot, box, OUT } = c;
  await page.getByText('Export Reports', { exact: true }).first().click(); await page.waitForTimeout(3000);
  const dlg = page.locator('.q-dialog').last();
  const pick = async (tid, label) => { await dlg.locator(`[data-test-id="${tid}"]`).first().click(); await page.waitForTimeout(1200);
    await page.getByRole('option', { name: label, exact: true }).first().click(); await page.waitForTimeout(1200); };
  await pick('select_report_name', 'Payroll Timesheet');
  meta.export_dialog_default = (await dlg.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400);
  if (range) await pick('select_date_range', range);
  if (range === 'Custom') { for (const [n, v] of [['export_startDate', from], ['export_endDate', to]]) { const i = dlg.locator(`input[name="${n}"]`).first(); await i.click(); await i.fill(v); await page.keyboard.press('Tab'); await page.waitForTimeout(800); } }
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(300);
  const d2 = page.locator('.q-dialog').last(); meta.export_dialog = (await d2.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400);
  if (shotName) await shot(shotName + '-dialog', { dlg: await box(d2) });
  meta.export_range_options = await (async () => { try { await d2.locator('[data-test-id="select_date_range"]').first().click(); await page.waitForTimeout(1200); const o = await page.getByRole('option').allInnerTexts(); await page.keyboard.press('Escape'); await page.waitForTimeout(500); return o; } catch (e) { return String(e).slice(0, 100); } })();
  const btn = d2.locator('button').filter({ hasText: /^\s*Export\s*$/ }).first();
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), btn.click()]);
  const f = `${OUT}/${dl.suggestedFilename()}`; await dl.saveAs(f); meta.download = { file: f, name: dl.suggestedFilename() };
  await page.waitForTimeout(2000); return f;
}
