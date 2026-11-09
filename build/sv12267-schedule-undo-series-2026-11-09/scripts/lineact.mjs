// usage: node lineact.mjs <tag> <lineIdx> <action=authorized|authorization_declined|complete> -> clicks that line's action button on the Lines tab (screen), handles any confirm, prints writes + labor names
import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,I,ACT]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12267/wo-${TAG}.json`,'utf8')); const id=S.lines[Number(I)]; const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500); const n=s.writes.length;
const b=p.locator(`[data-test-id="button_action_${ACT}_line_${id}"]`); console.log('button',await b.count(), await b.count()?await b.innerText():'');
await b.click(); await p.waitForTimeout(1800);
for(let k=0;k<3;k++){ const dl=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(x=>[...x.querySelectorAll('button')].map(e=>(e.getAttribute('data-test-id')||'')+'='+e.innerText.trim()).join(' | '))); if(!dl.length) break; console.log('dialog',dl); const c=p.locator('.q-dialog button').filter({hasText:/^(Yes|Confirm|Approve|Are You Sure\?|OK|Decline|Complete)$/i}).last(); if(!(await c.count())) break; await c.click(); await p.waitForTimeout(1800);} 
await p.waitForTimeout(1500); console.log('writes',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,220))));
const lab=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="line_labor_name_"],[data-test-id^="badge_line_status_"]')].map(e=>e.getAttribute('data-test-id').replace(/_[0-9a-f-]{36}$/,m=>m.slice(0,7))+'='+e.innerText.trim()));
console.log('screen',lab.join(' ; ')); await p.screenshot({path:`../ev/${TAG}-lineact-${I}-${ACT}.png`}); await s.close(); process.exit(0);
