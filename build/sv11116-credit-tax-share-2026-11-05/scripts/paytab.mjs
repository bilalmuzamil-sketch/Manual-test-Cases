// usage: node paytab.mjs <tag> <shot> -> Customer > Payments tab text + screenshot
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,SHOT]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11116/seed-${TAG}.json`,'utf8')); const s=await sess({dpr:2}); const p=s.page;
await s.go(`/customers/${S.company}/payments`); await p.waitForTimeout(5000); console.log('URL',p.url());
console.log('ROWS',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('table tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,250)))));
const ex=p.locator('table tbody tr button, table tbody tr .q-icon').filter({hasText:/expand|keyboard_arrow/}).first(); if(await ex.count()){ await ex.click(); await p.waitForTimeout(1500); console.log('EXPANDED',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('table tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,250))))); }
await p.screenshot({path:`../ev/${SHOT}.png`}); await s.close(); process.exit(0);
