// Switch the on-screen location (profile menu -> select_location -> option whose last line equals name).
export async function setLoc(s, name) {
  const p = s.page;
  await s.go('/workorders'); await p.waitForTimeout(3500);
  const cur = await p.evaluate(() => document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.split('\n')[0] || '');
  if (cur.trim() === name) return cur;
  await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1000);
  await p.click('[data-test-id="select_location"]'); await p.waitForTimeout(1200);
  for (const e of await p.$$('.q-menu .q-item, [role=option]')) {
    const t = (await e.innerText()).trim();
    if (t.split('\n').pop().trim() === name) { await e.click(); await p.waitForTimeout(4000); break; }
  }
  return p.evaluate(() => document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.split('\n')[0]);
}
