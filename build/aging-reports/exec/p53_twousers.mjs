// p53_twousers.mjs — 11 Nov 2026: can a second tester lane run beside the main one without ending its sign-in? Signs in as Admin (quick-login
// "admin") and, in a separate browser, as the Tech user (quick-login "tech"), then for 90 s both call /api/auth/me/fe-permissions every 10 s and
// open a report page. Records status codes, the Tech user's permission count and whether it can open the aging reports. Read only: no data, no role
// change. Output p53/out.json. Decision rule: every Admin call 200 throughout AND every Tech call 200 = two lanes are safe for READ-ONLY work.
import { boot } from '../../testing-tools/qa-branch-boot.mjs'; import fs from 'fs';
const OUT = new URL('./p53/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const o = { admin: [], tech: [] };
const API = 'https://sv11315api.qa.shopview.com';
const call = (pg) => pg.evaluate(async (u) => { const r = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } }); const j = await r.json().catch(() => null); return { st: r.status, n: j?.data?.fe_permissions?.length ?? j?.fe_permissions?.length ?? null }; }, API + '/api/auth/me/fe-permissions');
try { const A = await boot('sv11315', '/reports/ar-aging-summary', 'admin'); o.adminBoot = { slug: A.templateSlug, perms: A.nFePerms }; o.admin.push({ t: 0, ...(await call(A.page)) });
  const B = await boot('sv11315', '/reports/ar-aging-summary', 'tech'); o.techBoot = { slug: B.templateSlug, perms: B.nFePerms, role: B.role };
  for (let t = 10; t <= 90; t += 10) { await A.page.waitForTimeout(10000); o.admin.push({ t, ...(await call(A.page)) }); o.tech.push({ t, ...(await call(B.page)) }); fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); }
  await B.page.goto('https://sv11315.qa.shopview.com/reports/ap-aging-summary'); await B.page.waitForTimeout(4000); o.techReport = { url: B.page.url(), text: (await B.page.locator('main').innerText().catch(() => '')).slice(0, 200) }; await B.page.screenshot({ path: OUT + 'tech-report.png' });
  o.adminAfter = await call(A.page); o.safe = o.admin.every((x) => x.st === 200) && o.adminAfter.st === 200 && o.tech.every((x) => x.st === 200);
} catch (e) { o.err = String(e).slice(0, 400); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify({ safe: o.safe, adminBoot: o.adminBoot, techBoot: o.techBoot, err: o.err })); process.exit(0);
