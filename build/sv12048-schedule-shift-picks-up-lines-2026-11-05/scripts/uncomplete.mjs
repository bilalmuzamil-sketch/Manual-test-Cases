import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,I]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500);
await p.locator('[data-test-id="line_title"]').nth(Number(I)).click({button:'right'}); await p.waitForTimeout(1200);
console.log('MENU',await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim()).join(' | ')));
const it=p.locator('.q-menu [data-test-id]').filter({hasText:/uncomplete|un-complete|reopen|Mark as Authorized|Uncomplete/i}).first(); console.log('item',await it.count()); const n=s.writes.length;
if(await it.count()){ await it.click(); await p.waitForTimeout(1500); for(let k=0;k<2;k++){ const c=p.locator('.q-dialog button').filter({hasText:/^(Yes|Confirm|Are You Sure\?|Uncomplete)$/}); if(await c.count()){ await c.last().click(); await p.waitForTimeout(1800);} } }
console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,220)))); await p.screenshot({path:`../ev/${TAG}-uncomplete.png`}); await s.close(); process.exit(0);
