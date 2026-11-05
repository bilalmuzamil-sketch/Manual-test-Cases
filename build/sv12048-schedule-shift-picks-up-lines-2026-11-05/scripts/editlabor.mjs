// usage: node editlabor.mjs <tag> <lineIdx> [remove] -> line right-click > Edit labor: dump dialog; with "remove": remove the listed technician + save
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,I,ACT]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500);
await p.locator('[data-test-id="line_title"]').nth(Number(I)).click({button:'right'}); await p.waitForTimeout(1200); await p.locator('[data-test-id="menu-item_edit_labor"]').click(); await p.waitForTimeout(2500);
const dump=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(x=>x.innerText.replace(/\s+/g,' ').slice(0,500)+' || '+[...x.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,20)).join(',')));
console.log('DIALOG',await dump()); await p.screenshot({path:`../ev/${TAG}-editlabor-1.png`});
if(ACT==='remove'){ const n=s.writes.length; const x=p.locator('.q-dialog [data-test-id*="remove"], .q-dialog .q-chip__icon--remove, .q-dialog button:has-text("close")').first(); console.log('remove ctl',await x.count()); await x.click(); await p.waitForTimeout(1200); console.log('after remove',await dump()); await p.screenshot({path:`../ev/${TAG}-editlabor-2.png`});
  const sv=p.locator('.q-dialog button').filter({hasText:/^(Save|Update|Confirm)/}).last(); if(await sv.count()){ await sv.click(); await p.waitForTimeout(2500);} for(let k=0;k<2;k++){ const c=p.locator('.q-dialog button').filter({hasText:/^(Yes|Confirm|Are You Sure\?|Remove)$/}); if(await c.count()){ await c.last().click(); await p.waitForTimeout(2000);} }
  console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,300)))); await p.screenshot({path:`../ev/${TAG}-editlabor-3.png`}); }
await s.close(); process.exit(0);
