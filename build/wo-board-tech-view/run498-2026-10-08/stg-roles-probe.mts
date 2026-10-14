/** read-only: staging roles list shape and one role's permissions, workplaces with their technicians count */
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
import { ORG } from './profile.mts';
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/customers', key: 'admin' }) as any;
const a = api(p);
for (const u of ['/api/roles', '/api/roles?limit=200', '/api/roles?pagination[rowsPerPage]=200']) { const x = await a.get(u); console.log('try', u, x.status, JSON.stringify(x.body).slice(0, 400)); }
const r = await a.get('/api/roles?pagination[rowsPerPage]=200'); const roles = r.body?.data?.collection ?? r.body?.data ?? [];
console.log('roles', r.status, roles.length, JSON.stringify(roles.map((x: any) => `${x.label ?? x.name}${x.is_system ? '(sys)' : ''}`)).slice(0, 1500));
const wo = roles.find((x: any) => /view only|viewonly/i.test(x.label ?? x.name ?? '')); console.log('viewonly', JSON.stringify(wo ?? null).slice(0, 300));
const one = roles.find((x: any) => /^Technician$/i.test(x.label ?? x.name ?? '')) ?? roles[0]; const d = await a.get(`/api/roles/${one?.id}`); console.log('techrole', d.status, JSON.stringify(d.body).slice(0, 1500));
await browser.close(); process.exit(0);
