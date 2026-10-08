/** After switching to the view-only person, which permissions does the PAGE use? (server list vs the app's own copy) */
import { open, done, APP } from './session.mts';
import { api, candidates } from './data.mts';
import { staffRows, HEAVY } from './staff.mts';
import { t, display, search, boardCols, toColumn } from './wob.mts';
const { browser, page: p } = await open('/workorders');
const a = api(p);
const VO = (await staffRows(a, 'zz.wob.viewonly@staging.shopview.local'))[0];
const TW = (await staffRows(a, 'zz.wob.theresa.webb@staging.shopview.local'))[0];
console.log(t(), 'Theresa', TW.defaultWorkplaceName, TW.workplace_id, '| candidate at Heavy:', (await candidates(a)).some((x) => x.name === 'Theresa Webb'));
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const s = await a.post('/api/switch-user', { user_id: VO.id }); console.log(t(), 'switch', s.status);
await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' });
const read = async (label: string) => {
  const srv = (await a.get('/api/auth/me/fe-permissions')).body; const list = srv?.data?.fe_permissions ?? srv?.data ?? [];
  const local = await p.evaluate(`(() => { try { const w = JSON.parse(localStorage.getItem('fe_permissions_wrapper') || 'null'); const s = JSON.stringify(w) || ''; return { has: !!w, createEdit: s.includes('workOrdersCreateAndEdit'), len: s.length }; } catch (e) { return String(e); } })()`);
  const user = await p.evaluate(`(() => { try { const u = JSON.parse(localStorage.getItem('user') || 'null'); return JSON.stringify(u).slice(0, 160); } catch (e) { return null; } })()`);
  console.log(t(), label, '| server perms', Array.isArray(list) ? list.length : '?', 'createEdit', JSON.stringify(list).includes('workOrdersCreateAndEdit'), '| page copy', JSON.stringify(local), '| user', user);
};
await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await read('after goto');
await p.goto(APP + '/dashboard', { waitUntil: 'load' }); await p.waitForTimeout(4000); await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await read('after dashboard');
await display(p, 'Board View'); await search(p, 'ZZAUTOTEST F2 Empty Columns');
console.log(t(), 'first cols', JSON.stringify((await boardCols(p)).slice(0, 3).map((c) => `${c.name}:${c.empty}`)));
console.log(t(), 'avatar', await p.evaluate(`(document.querySelector('[data-test-id="profile_menu_button"]') || {}).innerText`));
const e = await a.post('/api/exit-switch-user', {}); if (e.status >= 300) await a.post('/api/switch-user', { user_id: me.id }); console.log(t(), 'exit', e.status);
await done(browser);
