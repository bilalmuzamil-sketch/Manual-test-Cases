/** Who is the "Tech" quick-login on this branch? (C97012 needs that person's staff row.) */
process.env.GS_LOGIN_AS = 'tech';
import { api } from './data.mts';
const { signIn } = await import('../../global-search/e2e/fixtures/auth.js');
const s: any = await signIn('/workorders', undefined, undefined, 'tech');
const a = api(s.page); const r = await a.get('/api/auth/me'); const fp = await a.get('/api/auth/me/fe-permissions');
console.log('STATUS', r.status, 'fe', fp.status, (fp.body?.data ?? fp.body ?? []).length, 'bodyKeys', Object.keys(r.body ?? {}), 'dataKeys', Object.keys(r.body?.data ?? {}).slice(0, 40));
await s.page.locator('[data-test-id="profile_menu_button"]').click({ timeout: 20000 }); await s.page.waitForTimeout(1500);
console.log('MENU', JSON.stringify(await s.page.locator('.q-menu').last().innerText().catch(() => '')).slice(0, 400));
console.log('BTN', JSON.stringify(await s.page.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => '')));
const me = {};
const pick = (o: any) => Object.fromEntries(Object.entries(o).filter(([k, v]) => /name|email|id$|role/i.test(k) && (typeof v !== 'object' || v === null)));
console.log('TECH', JSON.stringify({ ...pick(me), staff: me.staff ? pick(me.staff) : null, role: me.role ? pick(me.role) : null }).replace(/[0-9a-f]{32,}/g, '<hidden>'));
await Promise.race([s.browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
