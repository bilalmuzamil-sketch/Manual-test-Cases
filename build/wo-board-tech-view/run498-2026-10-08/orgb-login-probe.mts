/** Why does organisation B's login answer 401? Print the refusal text (never the password). Also try the e-mail lower-cased
 *  and as "email" instead of "username". Read-only apart from the login attempts. */
import { request } from 'playwright';
import fs from 'node:fs';
const env = Object.fromEntries(fs.readFileSync('/tmp/shopview/sv10043-orgb.env', 'utf8').trim().split('\n').map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const API = 'https://sv10043api.qa.shopview.com'; const sso = process.env.GS_SSO || '';
const rc = await request.newContext({ ignoreHTTPSErrors: true, extraHTTPHeaders: { Accept: 'application/json', Origin: 'https://sv10043.qa.shopview.com', Referer: 'https://sv10043.qa.shopview.com/login', Cookie: `sv_sso_session=${sso}` } });
for (const body of [{ username: env.SV_USER, password: env.SV_PASS }, { email: env.SV_USER, password: env.SV_PASS }, { username: env.SV_USER.toLowerCase(), password: env.SV_PASS }]) {
  const r = await rc.post(`${API}/api/login`, { data: body }); const t = (await r.text()).replace(/[0-9a-f]{32,}/g, '<h>').replace(/"token":"[^"]+"/g, '"token":"<h>"');
  console.log('LOGIN', Object.keys(body)[0], r.status(), t.slice(0, 300));
}
const c = await rc.post(`${API}/api/login`, { data: { username: 'nobody-zz@shopview.com', password: 'zz' + Date.now() } }); console.log('CONTROL wrong account', c.status(), (await c.text()).slice(0, 200));
process.exit(0);
