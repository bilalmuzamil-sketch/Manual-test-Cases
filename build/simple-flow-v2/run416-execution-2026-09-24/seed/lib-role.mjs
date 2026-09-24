export const APP='https://app.shopview.com';
// Build a custom role from the Admin template with named switches flipped.
// Built FROM Admin on purpose: the role must keep App Settings, or I cannot switch myself back.
export async function createRole(page, name, changes) {
  await page.goto(`${APP}/administration/roles-permissions`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(10000);
  await page.locator('.q-btn:has-text("Create custom role")').first().click();
  await page.waitForTimeout(6000);
  const picked = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog'); if (!d) return 'no template dialog';
    const card = [...d.querySelectorAll('div,li,button')].find(e => /^Admin\b/.test((e.innerText||'').trim()) && (e.innerText||'').length < 60);
    if (!card) return 'no Admin template card'; card.click(); return 'picked Admin';
  });
  await page.waitForTimeout(2000);
  const applied = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog'); if (!d) return 'no dialog';
    const b = [...d.querySelectorAll('button,.q-btn')].find(x => (x.innerText||'').trim() === 'Apply');
    if (!b) return 'no Apply'; b.click(); return 'applied';
  });
  await page.waitForTimeout(11000);
  await page.locator('.q-field:has-text("Role Name") input').first().fill(name);
  const flips = [];
  for (const [label, want] of Object.entries(changes)) {
    const r = await page.evaluate(([L, w]) => {
      let el = null; for (const e of document.querySelectorAll('*')) if (e.children.length === 0 && (e.textContent||'').trim() === L) { el = e; break; }
      if (!el) return L + ': label not on the page';
      let row = el.parentElement, tg = null;
      for (let i = 0; i < 6 && row; i++) { tg = row.querySelector('.q-toggle'); if (tg) break; row = row.parentElement; }
      if (!tg) return L + ': no switch beside it';
      const isOn = tg.getAttribute('aria-checked') === 'true';
      if (isOn === w) return `${L}: already ${w ? 'on' : 'off'}`;
      tg.scrollIntoView({ block: 'center' }); (tg.querySelector('input') || tg).click();
      return `${L}: ${isOn ? 'on' : 'off'} -> ${w ? 'on' : 'off'}`;
    }, [label, want]);
    flips.push(r);
    await page.waitForTimeout(700);
  }
  const created = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button,.q-btn')].filter(x => x.getBoundingClientRect().width)
      .find(x => /^(Create|Save)$/i.test((x.innerText||'').trim()));
    if (!b) return 'no Create button'; b.scrollIntoView({ block: 'center' }); b.click(); return 'pressed ' + (b.innerText||'').trim();
  });
  await page.waitForTimeout(6000);
  const anyway = await page.evaluate(() => { const d = document.querySelector('.q-dialog'); if (!d) return null;
    const b = [...d.querySelectorAll('button,.q-btn')].find(x => /Anyway/i.test((x.innerText||'').trim())); if (b) { b.click(); return 'pressed Edit Anyway'; }
    return 'dialog: ' + (d.innerText||'').replace(/\s+/g,' ').slice(0,160); });
  await page.waitForTimeout(10000);
  return { picked, applied, flips, created, anyway, url: page.url() };
}
// Put my own account into a role, through the Edit Staff Member dialog.
export async function setMyRole(page, filterRole, toRole) {
  await page.goto(`${APP}/administration/staff?roles=${encodeURIComponent(filterRole)}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(10000);
  const row = page.locator('tr', { hasText: 'bilal.muzamil@shopview.com' }).first();
  if (!(await row.count())) return 'my row is not listed under ' + filterRole;
  await row.hover(); await page.waitForTimeout(1200);
  await row.locator('.q-btn:has-text("edit")').first().click();
  await page.waitForTimeout(7000);
  await page.evaluate(() => { const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    const f=[...d.querySelectorAll('.q-field')].find(x=>/^Role/.test((x.innerText||'').trim())); f.scrollIntoView({block:'center'}); f.click(); });
  await page.waitForTimeout(3500);
  const chose = await page.evaluate((n)=>{ const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>(e.innerText||'').trim()===n);
    if(!it) return 'not offered: '+[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim()).join(' | ').slice(0,250);
    it.click(); return 'chose '+n; }, toRole);
  if (chose.startsWith('not offered')) return chose;
  await page.waitForTimeout(2500);
  const saved = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/Save/.test((x.innerText||'').trim())); if(!b) return 'no save'; b.click(); return 'pressed '+(b.innerText||'').trim(); });
  await page.waitForTimeout(10000);
  return chose + ' | ' + saved;
}
