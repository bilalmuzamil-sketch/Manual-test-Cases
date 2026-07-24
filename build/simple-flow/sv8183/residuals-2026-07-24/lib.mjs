// lib.mjs — SV-8183 residuals helper. Secret-free (reads /tmp/cln/cookies.json).
import fs from 'fs';
const c = JSON.parse(fs.readFileSync('/tmp/cln/cookies.json', 'utf8'));
const baseCookie = Object.entries(c).map(([k, v]) => `${k}=${v}`).join('; ');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const BASE = 'https://api.staging.shopview.com';
export function hdrs(cookie) {
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
export async function switchUser(sessCookie, userId) {
  return api(sessCookie, 'POST', '/api/switch-user', { user_id: userId });
}
export const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
export const WP = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
