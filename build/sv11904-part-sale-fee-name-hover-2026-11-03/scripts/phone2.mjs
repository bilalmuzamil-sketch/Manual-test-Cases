import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv11904/'+f,'utf8').trim(); const PS='90a95f29-f405-4763-834d-6e3a237f8c33'; const OUT='/tmp/sv11904/m';
const s=await open({env:'branch',ticket:'11904',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa41',vp:{width:375,height:812},dpr:3,touch:true}); const p=s.page;
const tips=()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>{const r=t.getBoundingClientRect(); return t.innerText.trim()+'@'+[r.x,r.y,r.width,r.height].map(Math.round);}));
const dlgN=()=>p.evaluate(()=>document.querySelectorAll('.q-dialog').length);
const run=async(i)=>{ await s.go(`/parts/part-sale/${PS}/part-requests`); await p.waitForTimeout(7000); await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
  await p.evaluate(i=>[...document.querySelectorAll('[data-test-id^="text_part_adjustment_name_"]')][i].scrollIntoView({block:'center',inline:'center'}),i); await p.waitForTimeout(800);
  const r=await p.evaluate(i=>{const e=[...document.querySelectorAll('[data-test-id^="text_part_adjustment_name_"]')][i]; const q=e.getBoundingClientRect(); return [q.x,q.y,q.width,q.height,e.textContent];},i);
  await p.touchscreen.tap(r[0]+Math.min(r[2]/2,30),r[1]+r[3]/2); 
  for(const t of [500,3000,6000]){ await p.waitForTimeout(t===500?500:t-(t===3000?500:3000)); console.log(`row${i} ${JSON.stringify(r[4].trim())} +${t}ms tips`,JSON.stringify(await tips()),'dialogs',await dlgN()); }
  await p.screenshot({path:`${OUT}/phone-row${i}-6s.png`});
  // tap an empty spot inside the dialog title area
  const db=await p.evaluate(()=>{const c=document.querySelector('.q-dialog .q-card'); const q=c.getBoundingClientRect(); return [q.x,q.y,q.width,q.height];});
  await p.touchscreen.tap(db[0]+db[2]-60,db[1]+30); await p.waitForTimeout(1200); console.log(`row${i} after tap inside dialog tips`,JSON.stringify(await tips()),'dialogs',await dlgN());
  const c=p.locator('.q-dialog button',{hasText:/^Close$/}).first(); await c.tap(); await p.waitForTimeout(1500); console.log(`row${i} after Close tips`,JSON.stringify(await tips()),'dialogs',await dlgN());
  await p.screenshot({path:`${OUT}/phone-row${i}-closed.png`}); };
await run(0); await run(1);
await s.close(); process.exit(0);
