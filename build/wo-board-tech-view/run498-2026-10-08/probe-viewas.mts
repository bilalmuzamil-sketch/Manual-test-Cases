import { open, done, APP } from './session.mts';
import { api, candidates } from './data.mts';
import { staffRows } from './staff.mts';
import { viewAs } from './viewas.mts';
import { t, display, search, boardCols } from './wob.mts';
const { browser, page: p } = await open('/workorders');
const a = api(p);
const VO = (await staffRows(a, 'zz.wob.viewonly@staging.shopview.local'))[0];
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
console.log(t(), 'clear any left-over switch', (await a.post('/api/exit-switch-user', {})).status);
const v = await viewAs(browser, p, a, VO.id, me.id);
try {
console.log(t(), 'switch answer keys', JSON.stringify(v.userKeys), 'perms', v.perms);
await v.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await v.page.waitForTimeout(5000);
console.log(t(), 'url', v.page.url().replace(APP, ''), '| page copy has create&edit:', await v.page.evaluate(`(localStorage.getItem('fe_permissions_wrapper') || '').includes('workOrdersCreateAndEdit')`));
await display(v.page, 'Board View'); await search(v.page, 'ZZAUTOTEST F2 Empty Columns');
console.log(t(), 'first cols', JSON.stringify((await boardCols(v.page)).slice(0, 3).map((c) => `${c.name}:${c.empty}`)));
await v.page.screenshot({ path: 'evidence/probe-viewas.png' });
} finally { await v.close(); }
console.log(t(), 'admin again', (await a.get('/api/auth/me/fe-permissions')).body?.data?.length ?? '?');
await done(browser);
