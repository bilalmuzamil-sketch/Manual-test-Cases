import { start } from './lib.mjs';
const OUT = new URL('./46b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a);
await step('users', async () => { const res = await page.evaluate(async () => { const u = 'https://sv11315api.qa.shopview.com'; const out = {}; for (const url of ['/api/quick-login/users', u + '/api/quick-login/users']) { try { const r = await fetch(url, { credentials: 'include' }); out[url] = r.status + ' ' + (await r.text()).slice(0, 600); } catch (e) { out[url] = 'ERR ' + e.message; } } return out; });
  for (const [k, v] of Object.entries(res)) log(k.replace(/https?:\/\/[^/]+/, '<host>'), v.replace(/"(email|token|password)":"[^"]*"/g, '"$1":"…"')); });
await r.browser?.close?.(); process.exit(0);
