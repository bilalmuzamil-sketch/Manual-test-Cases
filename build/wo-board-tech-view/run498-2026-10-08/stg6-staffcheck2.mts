import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/schedule', key: 'admin' }) as any;
const a = api(p); const all: any[] = [];
for (let pg = 1; pg <= 10; pg++) { const r = (await a.get(`/api/staff?limit=200&page=${pg}`)).body?.data?.collection ?? []; all.push(...r); if (r.length < 200) break; }
const pick = (f: string, l: string) => all.find((x) => x.first_name === f && x.last_name === l);
const show = (x: any) => x && ({ name: `${x.first_name} ${x.last_name}`, role: x.role_label, billable: x.billable, clockable: x.clockable, active: x.is_active, deps: x.departments, invited: !!x.confirmed_invitation_on, wp: x.defaultWorkplaceName });
console.log(JSON.stringify({ total: all.length, karen: show(pick('Karen', 'Peck')), qa: show(pick('QA', 'Technician')), esther: show(pick('Esther', 'Howard')), dylan: show(pick('Dylan', 'Rush')),
  billable: all.filter((x) => x.billable).length, clock: all.filter((x) => x.clockable).length }, null, 1));
await browser.close(); process.exit(0);
