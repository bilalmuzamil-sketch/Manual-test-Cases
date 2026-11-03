import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv11904/'+f,'utf8').trim(); const PS='90a95f29-f405-4763-834d-6e3a237f8c33'; const OUT=process.env.OUT||'/tmp/sv11904/m';
const s=await open({env:'branch',ticket:'11904',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa41',vp:{width:1440,height:900},dpr:2,scrollbars:true}); const p=s.page;
const tips=()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>{const r=t.getBoundingClientRect(); return r.height>0&&getComputedStyle(t).opacity!=='0';}).map(t=>t.innerText.trim()));
const dlg=()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\n+/g,' | ').slice(0,400)));
const go=async()=>{ await s.go(`/parts/part-sale/${PS}/part-requests`); await p.waitForTimeout(6500); await p.evaluate(()=>{document.querySelectorAll('.q-notification').forEach(n=>n.remove()); const w=[...document.querySelectorAll('.q-table__middle')].sort((a,b)=>b.scrollWidth-a.scrollWidth)[0]; w.scrollLeft=w.scrollWidth;}); await p.waitForTimeout(800); };
const nameBox=async i=>p.evaluate(i=>{const e=[...document.querySelectorAll('[data-test-id^="text_part_adjustment_name_"]')][i]; const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height];},i);
// A: click straight on (after moving away first)
await go(); let [x,y,w,h]=await nameBox(0); await p.mouse.move(x+w/2,y+h/2,{steps:4}); await p.mouse.click(x+w/2,y+h/2); await p.waitForTimeout(1500);
console.log('A viewer',JSON.stringify(await dlg())); await p.screenshot({path:OUT+'/viewer-row0.png'});
// close
const close=p.locator('.q-dialog [data-test-id="button_close_dialog"]').first(); if(await close.count()) await close.click(); else await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
console.log('A after close dialogs',JSON.stringify(await dlg()),'tips',JSON.stringify(await tips())); await p.screenshot({path:OUT+'/viewer-closed.png'});
// B: hover, wait for tooltip, click without moving
await go(); [x,y,w,h]=await nameBox(1); await p.mouse.move(x+w/2,y+h/2,{steps:6}); await p.waitForTimeout(1300);
console.log('B tip before click',JSON.stringify(await tips()));
await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(400); console.log('B +0.4s tips',JSON.stringify(await tips()),'dialogs',(await dlg()).length); await p.screenshot({path:OUT+'/hover-then-click-0.4s.png'});
await p.waitForTimeout(1600); console.log('B +2s tips',JSON.stringify(await tips())); await p.screenshot({path:OUT+'/hover-then-click-2s.png'});
await p.mouse.move(x+w/2+40,y+h/2+60,{steps:4}); await p.waitForTimeout(800); console.log('B after small move tips',JSON.stringify(await tips()));
console.log('B viewer',JSON.stringify(await dlg()));
await s.close(); process.exit(0);
