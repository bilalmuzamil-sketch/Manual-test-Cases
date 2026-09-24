// Toggle one Work Orders setting and carry the confirmation through, capturing what the screen does.
export async function setWoSetting(page, labelIndex, { confirm = true, shotPath = null } = {}) {
  const clicked = await page.evaluate((i) => {
    const panel = [...document.querySelectorAll('.q-tab-panel')].find(p => (p.innerText || '').includes('Save Settings'));
    if (!panel) return 'no panel';
    const tg = panel.querySelectorAll('.q-toggle')[i];
    if (!tg) return 'no toggle';
    tg.scrollIntoView({ block: 'center' }); (tg.querySelector('input') || tg).click(); return 'clicked';
  }, labelIndex);
  if (clicked !== 'clicked') throw new Error(clicked);
  await page.waitForTimeout(1500);
  const saved = await page.evaluate(() => {
    const panel = [...document.querySelectorAll('.q-tab-panel')].find(p => (p.innerText || '').includes('Save Settings'));
    const btn = [...panel.querySelectorAll('button, .q-btn')].find(b => (b.innerText || '').trim() === 'Save Settings');
    if (!btn) return 'no save'; btn.scrollIntoView({ block: 'center' }); btn.click(); return 'saved';
  });
  if (saved !== 'saved') throw new Error(saved);
  await page.waitForTimeout(3500);
  const dlg = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog'); if (!d) return null;
    return { text: (d.innerText || '').trim(), buttons: [...d.querySelectorAll('button, .q-btn')].map(b => (b.innerText || '').trim()).filter(Boolean) };
  });
  if (shotPath) await page.screenshot({ path: shotPath });
  if (!confirm) { await page.keyboard.press('Escape'); await page.waitForTimeout(1500); return { dialog: dlg, confirmed: false }; }
  // press the affirmative button (Turn On / Turn Off), never Cancel
  const pressed = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog'); if (!d) return 'no dialog';
    const b = [...d.querySelectorAll('button, .q-btn')].find(x => /^Turn (On|Off)$/.test((x.innerText || '').trim()));
    if (!b) return 'no affirmative button'; b.click(); return 'pressed';
  });
  // watch for a progress indicator while it applies
  let progress = null;
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(700);
    const p = await page.evaluate(() => {
      const bits = [...document.querySelectorAll('.q-spinner, .q-linear-progress, .q-circular-progress, [role=progressbar]')].filter(e => e.getBoundingClientRect().width > 0);
      const d = document.querySelector('.q-dialog');
      return bits.length ? { n: bits.length, dialogText: d ? (d.innerText || '').trim().slice(0, 300) : null } : null;
    });
    if (p) { progress = p; break; }
  }
  await page.waitForTimeout(5000);
  return { dialog: dlg, confirmed: pressed === 'pressed', pressed, progress };
}
