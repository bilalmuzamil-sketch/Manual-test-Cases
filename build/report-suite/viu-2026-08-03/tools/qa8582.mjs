// qa8582.mjs — Report Suite QA-branch (sv8582) API helper.
// SECRET-FREE: reads cookies from /tmp/report-suite-viu/cookies.json at runtime.
// NEVER hard-code or commit cookie values (CLAUDE.md secrets rule).
//
// Env facts (proven live 2026-08-03):
//   app  = https://sv8582.qa.shopview.com
//   api  = https://sv8582api.qa.shopview.com   (no dot before "api", same as sv7301api)
//   auth = POST /api/quick-login {key:'admin'|'tech'} -> 200 + fresh PHPSESSID
//
// Usage (CLI): node qa8582.mjs <key> <METHOD> <path> ['<jsonBody>']
// Usage (import): import { login, api } from './qa8582.mjs';
import fs from 'fs';

const SECRETS = '/tmp/report-suite-viu/cookies.json';
const c = JSON.parse(fs.readFileSync(SECRETS, 'utf8'));
const baseCookie = `sv_sso_session=${c.sv_sso_session}; PHPSESSID=${c.PHPSESSID}; cf_clearance=${c.cf_clearance}`;
export const APP = 'https://sv8582.qa.shopview.com';
export const BASE = 'https://sv8582api.qa.shopview.com';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function hdrs(cookie) {
  return { Cookie: cookie, 'User-Agent': UA, Accept: 'application/json',
    Origin: APP, Referer: APP + '/' };
}

export async function login(key = 'admin') {
  const r = await fetch(BASE + '/api/quick-login', { method: 'POST', redirect: 'manual',
    headers: { ...hdrs(baseCookie), 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
  const sc = r.headers.get('set-cookie') || '';
  const m = sc.match(/PHPSESSID=([^;]+)/);
  let j = null; try { j = await r.json(); } catch {}
  const parts = baseCookie.split('; ').filter(p => !p.startsWith('PHPSESSID='));
  if (m) parts.unshift('PHPSESSID=' + m[1]);
  return { sessCookie: parts.join('; '), data: j && j.data, status: r.status, error: j && j.error };
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

// Cookie header for Playwright / curl consumers (secrets stay in memory only).
export function cookiePairs(sessCookie = baseCookie) {
  return sessCookie.split('; ').map(p => {
    const i = p.indexOf('=');
    return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.qa.shopview.com', path: '/', secure: true };
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , key, method, path, bodyStr] = process.argv;
  const { sessCookie, status, error } = await login(key || 'admin');
  if (status !== 200) { console.error('LOGIN FAILED', status, error); process.exit(2); }
  const res = await api(sessCookie, method || 'GET', path || '/api/auth/me/fe-permissions', bodyStr ? JSON.parse(bodyStr) : undefined);
  console.log('LOGIN', status, 'CALL', res.status);
  console.log(typeof res.body === 'string' ? res.body.slice(0, 6000) : JSON.stringify(res.body, null, 1).slice(0, 12000));
}
