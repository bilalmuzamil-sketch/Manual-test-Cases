import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${process.env.ENV||'branch'}-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page; const n0=s.reads?s.reads.length:0;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(3500);
await p.locator('.q-tab, [role=tab]').filter({hasText:/^Finance/}).first().click(); await p.waitForTimeout(4500);
console.log('FINTAB',(await p.locator('main, .q-page').first().innerText()).replace(/\s+/g,' ').slice(0,1500));
console.log('APIS',await p.evaluate(()=>[...new Set(performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/api\/(invoice|finance|work-orders\/[^/]+\/(finance|invoice))/i.test(u)).map(u=>u.replace(/^https:\/\/[^/]+/,'')))].slice(0,10)));
await p.screenshot({path:`../ev/branch-${process.argv[2]}-fintab.png`}); await s.close(); process.exit(0);
