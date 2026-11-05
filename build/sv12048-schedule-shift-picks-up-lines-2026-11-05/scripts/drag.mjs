// usage: node drag.mjs <tag> <staffIndex> <hour> [mode=entire|choose:<n>|none] [what=card|line:<i>] -> drags the WO's sidebar card (or one line from its line panel) onto a technician lane on tomorrow, handles the drop dialog
import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,SI,HR,MODE,WHAT]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8'));
const s=await sess(); const p=s.page; const OUT=`../ev/branch-drag-${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const R={};
const d=new Date(Date.now()+86400000).toISOString().slice(0,10); R.date=d;
await s.go('/schedule'); await p.waitForTimeout(4500);
const vt=p.locator('[data-test-id="schedule_view_toggle"]').getByText('Day',{exact:true}); if(await vt.count()) { await vt.first().click(); await p.waitForTimeout(1500); }
const mc=p.locator(`[data-test-id="button_mini_calendar_day_${d}"]`); if(await mc.count()){ await mc.first().click(); await p.waitForTimeout(2500); }
await p.locator('[data-test-id="input_sidebar_search"]').fill(S.number); await p.waitForTimeout(3000);
let src=p.locator('[data-test-id="sidebar_work_order_card"]',{hasText:S.number}).first(); R.cardFound=await src.count();
if(WHAT&&WHAT.startsWith('line')){ await src.click(); await p.waitForTimeout(2000); const i=Number(WHAT.split(':')[1]||0); src=p.locator('[data-test-id="sidebar_line_row"]').nth(i); R.lineRow=(await src.innerText()).replace(/\s+/g,' ').slice(0,80); }
const lanes=await p.evaluate(()=>[...document.querySelectorAll('[data-staff-id]')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect(); return {id:e.getAttribute('data-staff-id'),name:e.innerText.trim().split('\n')[0],x:r.x,y:r.y,w:r.width,h:r.height};}));
const lane=lanes[Number(SI||0)]; R.lane=lane;
// timeline x for the hour: use hour labels in the header
const hx=await p.evaluate(h=>{ const labs=[...document.querySelectorAll('.fc-timeline-slot-label, th.fc-timeline-slot')].filter(e=>e.offsetParent).map(e=>({t:e.innerText.trim(),x:e.getBoundingClientRect().x,w:e.getBoundingClientRect().width})); const want=(h%12||12)+(h<12?' AM':' PM'); const hit=labs.find(l=>l.t.replace(/\s+/g,' ').toUpperCase().startsWith(want)||l.t===want.replace(' ','').toLowerCase()); return {hit,sample:labs.slice(0,6)}; },Number(HR||9));
R.hourLabel=hx; const rowY=await p.evaluate(id=>{ const rows=[...document.querySelectorAll(`.fc-timeline-lane[data-resource-id="${id}"], td.fc-timeline-lane[data-resource-id="${id}"], [data-resource-id="${id}"]`)].filter(e=>e.offsetParent&&e.getBoundingClientRect().width>400); const r=rows[0]?.getBoundingClientRect(); return r?{y:r.y+r.height/2,x:r.x,w:r.width}:null; },lane.id);
R.rowY=rowY; const tx=(hx.hit?hx.hit.x+10:rowY.x+200), ty=rowY?rowY.y:lane.y+lane.h/2;
const b=await src.boundingBox(); await p.mouse.move(b.x+b.width/2,b.y+b.height/2); await p.mouse.down(); for(let i=1;i<=4;i++){ await p.mouse.move(b.x+b.width/2+i*3,b.y+b.height/2+i*3); await p.waitForTimeout(40);} 
for(let i=1;i<=24;i++){ await p.mouse.move(b.x+(tx-b.x)*i/24,b.y+(ty-b.y)*i/24); await p.waitForTimeout(55);} await p.waitForTimeout(400); await p.mouse.up(); await p.waitForTimeout(2500);
R.dialog=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(x=>({text:x.innerText.replace(/\s+/g,' ').slice(0,500),ids:[...x.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,30)).slice(0,40)})));
await p.screenshot({path:OUT+'/1-drop.png'});
const n=s.writes.length;
if(MODE&&MODE!=='none'&&R.dialog.length){ if(MODE.startsWith('choose')){ await p.locator('[data-test-id="tab_drop_choose_lines"]').click(); await p.waitForTimeout(1200); const k=Number(MODE.split(':')[1]||99); const cbs=p.locator('.q-dialog [role=checkbox]'); const cnt=await cbs.count(); R.chooseBoxes=cnt; for(let i=0;i<cnt&&i<k;i++){ const c=cbs.nth(i); if((await c.getAttribute('aria-checked'))!=='true') await c.click(); await p.waitForTimeout(300);} await p.screenshot({path:OUT+'/2-choose.png'}); }
  const conf=p.locator('[data-test-id="button_drop_confirm"]'); R.confirmText=(await conf.innerText()).trim(); await conf.click(); await p.waitForTimeout(3500); }
R.sent=s.writes.slice(n).map(w=>w.slice(0,400)); await p.screenshot({path:OUT+'/3-after.png'});
console.log(JSON.stringify(R,null,1)); fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
