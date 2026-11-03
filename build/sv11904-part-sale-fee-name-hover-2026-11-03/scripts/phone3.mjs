import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv11904/'+f,'utf8').trim(); const PS='90a95f29-f405-4763-834d-6e3a237f8c33'; const OUT='/tmp/sv11904/m';
for(const mode of ['touch-tap','locator-tap']){
const s=await open({env:'branch',ticket:'11904',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa41',vp:{width:390,height:844},dpr:3,touch:true,scrollbars:true}); const p=s.page;
const tips=()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText.trim()));
await s.go(`/parts/part-sale/${PS}/part-requests`); await p.waitForTimeout(7000); await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
const L=p.locator('[data-test-id^="text_part_adjustment_name_"]').nth(1); await L.scrollIntoViewIfNeeded(); await p.waitForTimeout(800); const b=await L.boundingBox();
if(mode==='touch-tap') await p.touchscreen.tap(b.x+Math.min(b.width/2,30),b.y+b.height/2); else await L.tap({force:true,position:{x:Math.min(b.width/2,30),y:b.height/2}});
await p.waitForTimeout(1800); console.log(mode,'1.8s tips',JSON.stringify(await tips()),'dialogs',await p.evaluate(()=>document.querySelectorAll('.q-dialog').length));
await p.waitForTimeout(4200); console.log(mode,'6s tips',JSON.stringify(await tips())); await p.screenshot({path:`${OUT}/phone390-${mode}-6s.png`});
await s.close?.(); }
process.exit(0);
