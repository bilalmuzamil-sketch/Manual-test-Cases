import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/schedule', key: 'admin' }) as any;
const a = api(p);
const b = (await a.get(`/api/schedule/board?from=2026-10-14T00:00:00.000Z&to=2026-10-16T00:00:00.000Z`)).body?.data?.board;
for (const d of b.resources.departments) console.log('DEPT', d.name, d.id.slice(0, 8), 'techs', d.technicians.length, d.technicians.slice(0, 2).map((t: any) => JSON.stringify(t).slice(0, 260)).join(' || '));
console.log('other keys', Object.keys(b.resources));
const st = (await a.get('/api/staff?limit=200&search=Karen')).body?.data?.collection?.[0]; console.log('KAREN', JSON.stringify(st ?? null).slice(0, 700));
await browser.close(); process.exit(0);
