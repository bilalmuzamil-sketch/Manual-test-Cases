// probe.mjs — SV-8183 uncovered-areas re-run helper (rerun2-2026-07-24)
// Secret-free: reads cookies from /tmp/cln/cookies.json.
// Run with: NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node probe.mjs
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
  const j = await r.json().catch(() => null);
  const parts = baseCookie.split('; ').filter(p => !p.startsWith('PHPSESSID='));
  if (m) parts.unshift('PHPSESSID=' + m[1]);
  return { sessCookie: parts.join('; '), data: j?.data, status: r.status };
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
// Switch active user (impersonate). Returns a session cookie for that user.
export async function switchUser(sessCookie, userId) {
  const r = await api(sessCookie, 'POST', '/api/switch-user', { user_id: userId });
  // switch-user keeps same PHPSESSID (session-based); return same cookie
  return r;
}
export async function changeLocation(sessCookie, workplaceId, tz = 'America/Edmonton') {
  return api(sessCookie, 'POST', '/api/iam/change-location', { workplace_id: workplaceId, workplace_timezone: tz });
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , cmd, ...rest] = process.argv;
  if (cmd === 'call') {
    const [key, method, path, bodyStr] = rest;
    const { sessCookie, status } = await login(key);
    const res = await api(sessCookie, method, path, bodyStr ? JSON.parse(bodyStr) : undefined);
    console.log(JSON.stringify({ login: status, call: res.status, body: res.body }, null, 1));
  }
}
