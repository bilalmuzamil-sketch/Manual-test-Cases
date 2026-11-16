import { start, APP } from './common.mjs';
const WP = '41369a91-00f8-4cef-95e3-cd0fe3cdaea3';
const { browser, page } = await start({ workplaceId: WP, timezone: 'America/Denver' });
const r = await page.evaluate(() => { const u = JSON.parse(localStorage.getItem('user') || '{}'); const walk = (o, p = '') => Object.entries(o || {}).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v)) ? walk(v, p + k + '.') : [[p + k, Array.isArray(v) ? `[arr ${v.length}]` : (typeof v === 'string' && v.length > 40 ? v.slice(0, 12) + '…' : v)]]); return { keys: Object.keys(localStorage), user: walk(u).filter(([k]) => !/token|email|phone|name/i.test(k) || /workplace/i.test(k)) }; });
console.log(JSON.stringify(r.keys)); for (const [k, v] of r.user) console.log(k, '=', v);
await browser.close();
