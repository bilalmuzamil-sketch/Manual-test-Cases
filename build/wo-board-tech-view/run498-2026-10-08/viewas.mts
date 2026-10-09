/**
 * SEE THE SCREEN AS ANOTHER PERSON (2026-10-08). switch-user changes the SERVER session, but the sign-in context
 * re-writes the admin's own copy of `user` and `fe_permissions_wrapper` into localStorage on every page load
 * (boot.ts addInitScript), so a page in that context keeps the ADMIN's permissions — a view-only person then
 * looks able to reassign. Measured: server 24 permissions without workOrdersCreateAndEdit, page copy with it.
 * Fix: switch on the server, then open a NEW context carrying the same cookies and, before any page loads, the
 * switched person's own `user` (the switch-user answer, wrapped as {data: …}) and permissions.
 */
import type { Browser, Page } from 'playwright';
import { API } from './session.mts';
import type { Api } from './data.mts';
import { HEAVY } from './staff.mts';
export async function viewAs(browser: Browser, main: Page, a: Api, userId: string, adminStaffId: string, backTo?: () => Promise<void>) {
  let s = await a.post('/api/switch-user', { user_id: userId });
  if (s.status >= 300) { await a.post('/api/exit-switch-user', {}); s = await a.post('/api/switch-user', { user_id: userId }); }
  if (s.status >= 300) throw new Error(`switch ${s.status} ${JSON.stringify(s.body).slice(0, 160)}`);
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' });
  const fe = (await a.get('/api/auth/me/fe-permissions')).body?.data ?? null;
  const user = s.body?.data ?? null;
  const ctx = await browser.newContext({ storageState: await main.context().storageState(), viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {});
  await ctx.addInitScript(([u, f]: [any, any]) => {
    try { localStorage.setItem('user', JSON.stringify({ data: u })); if (f) localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u?.token) localStorage.setItem('token', u.token); } catch { /* */ }
  }, [user, fe] as any);
  const page = await ctx.newPage();
  const close = async () => { await ctx.close().catch(() => {}); if (backTo) return backTo(); const e = await a.post('/api/exit-switch-user', {}); if (e.status >= 300) await a.post('/api/switch-user', { user_id: adminStaffId }); };
  return { page, close, userKeys: user ? Object.keys(user) : null, perms: Array.isArray(fe) ? fe.length : (fe?.fe_permissions ?? []).length };
}
