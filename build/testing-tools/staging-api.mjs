// staging-api.mjs — authed fetch against the ShopView staging API through the
// agent proxy, using the browser cookies captured in /tmp/cln/cookies.json.
//
// SECRET-FREE: reads PHPSESSID / cf_clearance / sv_sso_session from
// /tmp/cln/cookies.json at runtime. Never hard-code cookie values here.
//
// Usage (CLI): node staging-api.mjs GET /api/auth/me/fe-permissions
//              node staging-api.mjs POST /api/some/path '{"json":"body"}'
// Usage (import): import { api } from './staging-api.mjs';
import fs from 'fs';

const c = JSON.parse(fs.readFileSync('/tmp/cln/cookies.json', 'utf8'));
const cookieHeader = Object.entries(c).map(([k, v]) => `${k}=${v}`).join('; ');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const BASE = 'https://api.staging.shopview.com';

export async function api(method, path, body) {
  const url = path.startsWith('http') ? path : BASE + path;
  const opts = { method, redirect: 'manual', headers: {
    'Cookie': cookieHeader, 'User-Agent': UA, 'Accept': 'application/json',
    'Origin': 'https://app.staging.shopview.com', 'Referer': 'https://app.staging.shopview.com/'
  } };
  if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const r = await fetch(url, opts);
  const t = await r.text();
  let j = null; try { j = JSON.parse(t); } catch {}
  return { status: r.status, body: j ?? t };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , method, path, bodyStr] = process.argv;
  const res = await api(method, path, bodyStr ? JSON.parse(bodyStr) : undefined);
  console.log('STATUS', res.status);
  console.log(typeof res.body === 'string' ? res.body.slice(0, 3000) : JSON.stringify(res.body, null, 1).slice(0, 4000));
}
