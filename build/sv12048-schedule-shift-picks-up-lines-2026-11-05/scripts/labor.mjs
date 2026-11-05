import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,SHOT]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500);
const lab=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="line_labor_name_"],[data-test-id^="badge_line_status_"]')].map(e=>e.getAttribute('data-test-id').replace(/_[0-9a-f-]{36}$/,m=>m.slice(0,7))+'='+e.innerText.trim().replace(/\s+/g,' ')));
console.log('LABOR',lab.join(' ; ')); if(SHOT) await p.screenshot({path:`../ev/${SHOT}.png`}); await s.close(); process.exit(0);
