/** why do the four ZZ technicians made today have no row on the staging Schedule? compare them with a technician who has one. */
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
import { staffRows } from './staff.mts';
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/schedule', key: 'admin' }) as any;
const a = api(p); const o: any = {};
for (const q of ['zz.wob.esther.howard', 'Karen Peck', 'QA Technician']) { const r = (await staffRows(a, q))[0]; o[q] = r ? Object.fromEntries(Object.entries(r).filter(([k]) => !/email|phone|avatar|photo|pin/i.test(k))) : null; }
const from = new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z', to = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z';
const b = (await a.get(`/api/schedule/board?from=${from}&to=${to}`)).body; o.boardKeys = Object.keys(b?.data ?? {}); 
const res = b?.data?.resources ?? b?.data?.technicians ?? b?.data?.staff ?? []; o.resCount = res.length; o.resSample = JSON.stringify(res[0] ?? null).slice(0, 400);
o.esther = JSON.stringify(res.find((x: any) => JSON.stringify(x).includes('Esther')) ?? null).slice(0, 300);
console.log(JSON.stringify(o, null, 1)); await browser.close(); process.exit(0);
