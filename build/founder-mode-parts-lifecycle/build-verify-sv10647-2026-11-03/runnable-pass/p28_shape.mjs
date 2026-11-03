// Probe 28 (read-only): shape of the Part Library list behind the Part Library page, and the roles list.
import { start } from '../probe/lib.mjs';
const { r, page } = await start(process.env.OUT);
const get = async u => page.evaluate(async u => { const x = await fetch('https://sv10647api.qa.shopview.com/api/' + u, { credentials: 'include', headers: { accept: 'application/json' } }); return x.status + ' ' + (await x.text()).slice(0, 1500); }, u);
console.log('CAT', await get('parts-catalogue/catalogue-parts?page=1&limit=2'));
const u = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));
console.log('ORG', u?.organization?.id || u?.organization_id || Object.keys(u).join(','));
await r.browser.close();
