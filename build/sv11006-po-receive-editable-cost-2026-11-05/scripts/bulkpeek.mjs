import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4000); const b0=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')));
await p.locator(`[data-test-id="line_number_${S.line}"]`).hover(); await p.waitForTimeout(500); await p.locator(`[data-test-id="line_checkbox_${S.line}"]`).click(); await p.waitForTimeout(1200);
const b1=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,25)));
console.log('NEW',b1.filter(x=>!b0.includes(x.split('=')[0])).join(' | ')); await p.screenshot({path:'../ev/branch-split-ticked.png'}); await s.close(); process.exit(0);
