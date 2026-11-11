// filt.mjs — 11 Nov 2026: filter helpers for the aging reports (learned p29): pick(kind,name) opens the "Customer:"/"Vendor:" chip, types
// in its search box, ticks the name, closes with Escape (the address then carries ?customerIds=/?vendorIds=); asOf(day) opens the As of
// calendar and clicks a day of the month shown; chip(kind) reads a chip's text.
export function mkFilt(p) {
  const chip = (re) => p.locator('main button', { hasText: re }).first();
  async function pick(kind, name) { await chip(new RegExp(kind + ':')).click(); await p.waitForTimeout(1200); const m = p.locator('.q-menu').last();
    await m.locator('input').first().type(name); await p.waitForTimeout(1800); await m.locator('.q-item, label, .q-checkbox').filter({ hasText: name }).first().click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(2500); }
  async function asOf(day) { await chip(/As of:/).click(); await p.waitForTimeout(1200); await p.locator('.q-menu').last().locator('button, .q-date__calendar-item').filter({ hasText: new RegExp('^' + day + '$') }).first().click(); await p.waitForTimeout(3000); }
  async function menuClick(kind, item) { await chip(new RegExp(kind + ':')).click(); await p.waitForTimeout(1200); const m = p.locator('.q-menu').last(); const txt = (await m.innerText().catch(() => '')).slice(0, 500);
    await m.locator('.q-item, label, .q-checkbox').filter({ hasText: item }).first().click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(2500); return txt; }
  const chips = () => p.evaluate(() => [...document.querySelectorAll('main button')].map((b) => b.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /^(\S+ )?(As of|Customer|Vendor|Past due|Location):/.test(t)));
  return { pick, asOf, chips, menuClick };
}
