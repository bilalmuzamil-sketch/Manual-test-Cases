export const APP = 'https://app.shopview.com';
export async function openWo(page, id, tab = 'lines') {
  await page.goto(`${APP}/workorders/${id}/${tab}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(9000);
  return page.url();
}
// Every button/menu-item text visible right now, with its enabled state - read from the smallest element that owns it.
export async function actions(page) {
  return await page.evaluate(() => {
    const out = [];
    for (const b of document.querySelectorAll('button, .q-btn, [role=menuitem], .q-item[clickable]')) {
      const r = b.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const t = (b.innerText || '').trim().replace(/\s+/g, ' ');
      if (!t) continue;
      out.push({ t, disabled: b.disabled === true || b.getAttribute('aria-disabled') === 'true' || /disabled/.test(b.className || '') });
    }
    const seen = new Set();
    return out.filter(o => { const k = o.t + '|' + o.disabled; if (seen.has(k)) return false; seen.add(k); return true; });
  });
}
export async function bodyText(page) { return await page.evaluate(() => document.body.innerText); }
