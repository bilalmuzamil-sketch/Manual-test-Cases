// usage: node linemenu.mjs <tag> <lineIdx> [itemRegex] -> right-click the line title, list menu; optionally click the item matching regex (handles Yes / Are You Sure?), print writes, screenshot ../ev/<tag>-linemenu.png
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,I,RX]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500);
await p.locator('[data-test-id="line_title"]').nth(Number(I)).click({button:'right'}); await p.waitForTimeout(1200);
console.log('MENU',await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim()).join(' | ')));
const n=s.writes.length;
if(RX){ const it=p.locator('.q-menu [data-test-id]').filter({hasText:new RegExp(RX,'i')}).first(); console.log('item',await it.count()); if(await it.count()){ await it.click(); await p.waitForTimeout(1500);
 for(let k=0;k<3;k++){ const dl=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(b=>(b.getAttribute('data-test-id')||'')+'='+b.innerText.trim()).join(' | ')); console.log('DIALOG',k,dl); const c=p.locator('.q-dialog button').filter({hasText:/^(Yes|Confirm|Are You Sure\?|Decline|Delete|Remove)$/i}); if(await c.count()){ await c.last().click(); await p.waitForTimeout(1800);} else break; } } }
console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,260)))); await p.screenshot({path:`../ev/${TAG}-linemenu.png`}); await s.close(); process.exit(0);
