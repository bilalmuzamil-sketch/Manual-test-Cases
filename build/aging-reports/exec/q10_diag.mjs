// q10_diag.mjs — 12 Nov 2026: why "Work order is not complete." for a work order at a new location (ZZAUTOTEST Q10 Loc 1). Reads the work order,
// its lines and the lines page (after switching to the location on screen), pictures. Output q10/diag.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./q10/', import.meta.url).pathname; const s = await start(OUT, '/workorders'); const p = s.page; const a = mk(p); const o = {};
const WO = process.env.WO || '1242c2d7-dd7b-48cb-ae89-78f433d79d4f';
o.wo = JSON.stringify((await a.get('/api/work-orders/' + WO)).j?.data || {}).slice(0, 1500);
o.lines = JSON.stringify((await a.get('/api/work-orders/lines/' + WO)).j?.data?.collection?.map((l) => ({ st: l.status, id: l.line_id, story: !!l.tech_story, hrs: l.hours, techs: l.technicians?.length })) || []);
const wps = ((await a.get('/api/workplaces')).j?.data?.collection || []).map((x) => [x.id, x.name]); o.wps = wps; const l1 = wps.find((w) => w[1] === 'ZZAUTOTEST Q10 Loc 1');
o.sw = (await S.loc(a, l1[0])).st; await p.evaluate((id) => localStorage.setItem('location', JSON.stringify(id)), l1[0]); await s.go('/workorders/' + WO + '/lines'); await p.waitForTimeout(3000);
o.dialog = (await p.locator('.q-dialog').allInnerTexts().catch(() => [])).join(' | ').replace(/\s+/g, ' '); o.hdr = (await p.locator('header').innerText()).replace(/\s+/g, ' ').slice(-80);
o.buttons = await p.evaluate(`[...document.querySelectorAll('main button, [data-test-id]')].map(b => (b.getAttribute('data-test-id')||'') + ':' + b.innerText.replace(/\\s+/g,' ').trim()).filter(t => /review|complete|invoice/i.test(t)).slice(0, 20)`);
await s.shot('diag-lines'); await S.loc(a); fs.writeFileSync(OUT + 'diag.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o, null, 1).slice(0, 3000)); await s.close(); process.exit(0);
