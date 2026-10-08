/** Read back Admin ShopView's Time Clock in a fresh sign-in (a change to your own Time Clock ends your session). */
import { open, done } from './session.mts';
import { api, candidates } from './data.mts';
import { staffRows } from './staff.mts';
const { browser, page: p } = await open('/customers');
const a = api(p);
const adm = (await staffRows(a, 'admin@shopview.com')).find((x) => x.email === 'admin@shopview.com');
console.log('clockable', adm?.clockable, '| lead candidate:', (await candidates(a)).some((x) => x.name === 'Admin ShopView'));
await done(browser);
