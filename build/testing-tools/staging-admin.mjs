// staging-admin.mjs — admin operations against ShopView staging via the
// dev quick-login (roles, staff/change, org lookups). Writes must go through
// the Admin dev-login session, not raw-API calls under the cookie owner.
//
// SECRET-FREE: reads cookies from /tmp/cln/cookies.json at runtime.
// login(key) POSTs /api/quick-login and returns a session cookie with a fresh
// PHPSESSID while preserving cf_clearance & sv_sso_session.
//
// Usage (CLI): node staging-admin.mjs <key> <METHOD> <path> ['<jsonBody>']
//   e.g. node staging-admin.mjs admin GET /api/auth/me/fe-permissions
// Usage (import): import { login, api } from './staging-admin.mjs';
import fs from 'fs';

const c = JSON.parse(fs.readFileSync('/tmp/cln/cookies.json', 'utf8'));
const baseCookie = Object.entries(c).map(([k, v]) => `${k}=${v}`).join('; ');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const BASE = 'https://api.staging.shopview.com';

function hdrs(cookie) {
  return { 'Cookie': cookie, 'User-Agent': UA, 'Accept': 'application/json',
    'Origin': 'https://app.staging.shopview.com', 'Referer': 'https://app.staging.shopview.com/' };
}

export async function login(key = 'admin') {
  const r = await fetch(BASE + '/api/quick-login', { method: 'POST', redirect: 'manual',
    headers: { ...hdrs(baseCookie), 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
  const sc = r.headers.get('set-cookie') || '';
  const m = sc.match(/PHPSESSID=([^;]+)/);
  const j = await r.json();
  // rebuild cookie: replace PHPSESSID with the fresh one, keep cf_clearance & sv_sso_session
  const parts = baseCookie.split('; ').filter(p => !p.startsWith('PHPSESSID='));
  if (m) parts.unshift('PHPSESSID=' + m[1]);
  const sessCookie = parts.join('; ');
  return { sessCookie, data: j.data, status: r.status };
}

export async function api(sessCookie, method, path, body) {
  const url = path.startsWith('http') ? path : BASE + path;
  const opts = { method, redirect: 'manual', headers: hdrs(sessCookie) };
  if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const r = await fetch(url, opts);
  const t = await r.text();
  let j = null; try { j = JSON.parse(t); } catch {}
  return { status: r.status, body: j ?? t };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , key, method, path, bodyStr] = process.argv;
  const { sessCookie, status } = await login(key || 'admin');
  const res = await api(sessCookie, method || 'GET', path || '/api/auth/me/fe-permissions', bodyStr ? JSON.parse(bodyStr) : undefined);
  console.log('LOGIN', status, 'CALL', res.status);
  console.log(typeof res.body === 'string' ? res.body.slice(0, 4000) : JSON.stringify(res.body, null, 1).slice(0, 6000));
}
