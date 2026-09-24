// Work Orders settings tab: open it and read every setting's label, description and state.
export async function openWoSettings(page) {
  if (!/administration\/settings/.test(page.url())) {
    await page.goto('https://app.shopview.com/administration/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(9000);
  }
  const tabs = page.locator('[role=tab], .q-tab'); const n = await tabs.count();
  for (let i = n - 1; i >= 0; i--) { if ((await tabs.nth(i).innerText()).trim() === 'Work Orders') { await tabs.nth(i).click(); break; } }
  await page.waitForTimeout(5000);
}
// Pairs the visible label with its own toggle by walking the settings panel in document order.
export async function readWoSettings(page) {
  return await page.evaluate(() => {
    const panel = [...document.querySelectorAll('.q-tab-panel')].find(p => (p.innerText || '').includes('Save Settings')) || document.body;
    const groups = []; let cur = null;
    const nodes = panel.querySelectorAll('*');
    const seen = new Set();
    for (const el of nodes) {
      const txt = (el.innerText || '').trim();
      if (el.children.length === 0 && txt && txt.length < 40 && txt === txt.toUpperCase() && /^[A-Z ]+$/.test(txt)) {
        if (!seen.has('H' + txt)) { cur = { group: txt, settings: [] }; groups.push(cur); seen.add('H' + txt); }
      }
    }
    // toggles in document order
    const toggles = [...panel.querySelectorAll('.q-toggle')].map(tg => ({
      on: tg.getAttribute('aria-checked') === 'true' || /truthy/.test((tg.querySelector('.q-toggle__inner') || {}).className || ''),
      top: tg.getBoundingClientRect().top
    }));
    // labels: the bold setting names sit in the panel text between group headings
    const lines = (panel.innerText || '').split('\n').map(s => s.trim()).filter(Boolean);
    const out = []; let g = '';
    for (let i = 0; i < lines.length; i++) {
      const L = lines[i];
      if (/^[A-Z ]+$/.test(L) && L.length < 40) { g = L; continue; }
      if (L === 'Save Settings') continue;
      if (/^(Require|Automatically)/i.test(L)) out.push({ group: g, label: L, desc: lines[i + 1] || '' });
    }
    for (let i = 0; i < out.length; i++) out[i].on = toggles[i] ? toggles[i].on : null;
    return { groups: groups.map(x => x.group), settings: out, toggleCount: toggles.length };
  });
}
