import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,I]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500); const id=S.lines[Number(I)];
await p.locator(`[data-test-id="line_labor_name_${id}"]`).click(); await p.waitForTimeout(1500);
console.log('AFTER CLICK',await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id],.q-menu .q-item,.q-dialog [data-test-id],.q-popup-edit [data-test-id]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('data-test-id')||'item')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,30)).join(' | ')));
await p.locator(`[data-test-id="line_labor_name_${id}"]`).hover(); await p.waitForTimeout(1200); console.log('HOVER',await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(e=>e.innerText.replace(/\s+/g,' '))));
await p.screenshot({path:`../ev/${TAG}-labclick.png`}); await s.close(); process.exit(0);
