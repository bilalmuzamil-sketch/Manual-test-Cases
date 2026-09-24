export async function setSetting(page, label, on) {
  await page.goto('https://app.shopview.com/administration/settings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(9000);
  const tabs = page.locator('[role=tab], .q-tab'); const n = await tabs.count();
  for (let i = n - 1; i >= 0; i--) if ((await tabs.nth(i).innerText()).trim() === 'Work Orders') { await tabs.nth(i).click(); break; }
  await page.waitForTimeout(5000);
  const idx = await page.evaluate((L) => {
    const panel = [...document.querySelectorAll('.q-tab-panel')].find(p => (p.innerText || '').includes('Save Settings'));
    const lines = (panel.innerText || '').split('\n').map(s => s.trim()).filter(Boolean);
    const labels = []; for (const l of lines) if (/^Require /i.test(l)) labels.push(l);
    const i = labels.indexOf(L); if (i < 0) return { i: -1, labels };
    const tg = panel.querySelectorAll('.q-toggle')[i];
    return { i, isOn: tg.getAttribute('aria-checked') === 'true' };
  }, label);
  if (idx.i < 0) throw new Error('setting not found: ' + label + ' | on the page: ' + JSON.stringify(idx.labels));
  if (idx.isOn === on) return `${label} already ${on ? 'on' : 'off'}`;
  await page.locator('.q-tab-panel:has-text("Save Settings") .q-toggle').nth(idx.i).click();
  await page.waitForTimeout(3000);
  const aff = page.locator('.q-dialog').locator(`button:has-text("Turn ${on ? 'On' : 'Off'}"), .q-btn:has-text("Turn ${on ? 'On' : 'Off'}")`).first();
  if (await aff.count()) { await aff.click(); await page.waitForTimeout(2500); }
  await page.locator('.q-tab-panel:has-text("Save Settings") .q-btn:has-text("Save Settings")').first().click({ timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(7000);
  return `${label} -> ${on ? 'on' : 'off'}`;
}
// Add a part to a line through the inline row the "Add Part" link opens.
export async function addPart(page, lineId, { number, description, qty = 1, cost = null, source = 'inventory' }) {
  const link = page.locator(`tr.line-row-${lineId} ~ tr a:has-text("Add Part"), .q-btn:has-text("Add Part")`);
  // the Add Part links are in line order; use the one inside this line's block
  const ok = await page.evaluate((id) => {
    const tr = document.querySelector(`tr.line-row-${id}`); if (!tr) return 'no line row';
    let el = tr.nextElementSibling, hops = 0;
    while (el && hops < 12) { const t = (el.innerText || '').trim();
      if (/Add Part/.test(t)) { const a = [...el.querySelectorAll('a,button,.q-btn')].find(x => /Add Part/.test(x.innerText || '')); if (a) { a.click(); return 'clicked'; } }
      if (/^\d+$/.test(t.split('\n')[0] || '')) break;
      el = el.nextElementSibling; hops++; }
    return 'no Add Part under this line';
  }, lineId);
  if (ok !== 'clicked') throw new Error(ok);
  await page.waitForTimeout(2500);
  const pn = page.locator('input').filter({ hasNot: page.locator('[type=checkbox]') });
  await page.locator('.q-field:has-text("Part number") input').first().fill(String(number));
  await page.waitForTimeout(4000);
  // pick the INVENTORY suggestion, not the catalogue one - only the inventory one draws from stock
  const picked = await page.evaluate((want) => {
    const items = [...document.querySelectorAll('.q-menu .q-item')];
    const inv = items.find(e => /Inventory Qty/i.test(e.innerText || ''));
    const cat = items.find(e => new RegExp(want).test(e.innerText || ''));
    const target = want === 'catalog' ? cat : inv;
    if (!target) return 'no suggestion: ' + items.map(e => (e.innerText||'').replace(/\s+/g,' ').slice(0,50)).join(' || ');
    target.click(); return 'picked ' + (target.innerText||'').replace(/\s+/g,' ').slice(0,60);
  }, source === 'catalog' ? 'catalog' : 'inventory');
  if (picked.startsWith('no suggestion')) throw new Error(picked);
  await page.waitForTimeout(3000);
  // quantity, then save the row
  const qtyField = page.locator('.q-field:has-text("Qty") input').first();
  if (await qtyField.count()) { await qtyField.fill(String(qty)); await page.waitForTimeout(800); }
  const saved = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button,.q-btn')].filter(x => x.getBoundingClientRect().width)
      .find(x => (x.innerText||'').trim() === 'Save');
    if (!b) return 'no Save on the row'; b.click(); return 'saved';
  });
  await page.waitForTimeout(6000);
  return picked + ' | ' + saved;
}
