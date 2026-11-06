// print each part row's visible text (qty, price, margin, total, status) sorted by part name, for before/after compare
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12143-${ENV}.json`,'utf8')); const s=await sess(); const p=s.page;
await s.go('/workorders/'+S.id+'/lines'); await p.waitForTimeout(8000);
const r=await p.evaluate(()=>[...document.querySelectorAll('tr')].filter(r=>r.querySelector('[data-test-id^="part_number_"]')).map(r=>r.innerText.replace(/drag_indicator|edit|more_vert/g,'').replace(/\s+/g,' ').trim()));
fs.writeFileSync(`../ev/${ENV}-rows-${process.env.TAG}.json`,JSON.stringify(r,null,1)); console.log(r.slice().sort().join('\n')); await s.close(); process.exit(0);
