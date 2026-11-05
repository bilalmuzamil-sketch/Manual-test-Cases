// usage: node newwo.mjs <laneIdx> <hour> [dayOffset=1] [stage=peek|fill] -> clicks an empty Day-view cell, lists the cell menu, clicks "New Work Order", dumps dialog test-ids; stage=fill picks CUST/VEH env (typed search) and Saves
import {sess} from './common.mjs'; import fs from 'fs';
const [SI,HR,OFF,STAGE]=process.argv.slice(2); const s=await sess({dpr:1}); const p=s.page; const d=new Date(Date.now()+Number(OFF||1)*86400000).toISOString().slice(0,10);
await s.go('/schedule'); await p.waitForTimeout(4500);
const vt=p.locator('[data-test-id="schedule_view_toggle"]').getByText('Day',{exact:true}); if(await vt.count()){ await vt.first().click(); await p.waitForTimeout(1500);}
const mc=p.locator(`[data-test-id="button_mini_calendar_day_${d}"]`); if(await mc.count()){ await mc.first().click(); await p.waitForTimeout(3000);}
const lanes=await p.evaluate(()=>[...document.querySelectorAll('[data-staff-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-staff-id')));
const id=lanes[Number(SI)]; console.log('LANE',id); await p.locator(`[data-staff-id="${id}"]`).first().scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
const ly=await p.evaluate(id=>{const e=[...document.querySelectorAll(`[data-staff-id="${id}"]`)].find(x=>x.offsetParent).getBoundingClientRect(); return e.y+e.height-12;},id);
const hx=await p.evaluate(h=>{ const want=(h%12||12)+(h<12?' AM':' PM'); const l=[...document.querySelectorAll('.fc-timeline-slot-label, th.fc-timeline-slot')].filter(e=>e.offsetParent).find(e=>e.innerText.trim().toUpperCase().startsWith(want)); return l.getBoundingClientRect().x+20; },Number(HR));
await p.mouse.click(hx,ly); await p.waitForTimeout(1500); await p.screenshot({path:"/tmp/sv12048/newwo-click.png"});
console.log('MENU',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id="schedule_cell_menu"] [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim()).join(' | ')));
await p.locator('[data-test-id="schedule_cell_menu"]').getByText('New Work Order').first().click(); await p.waitForTimeout(3000);
const dump=async t=>console.log(t,await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(x=>x.innerText.replace(/\s+/g,' ').slice(0,500)+' || '+[...x.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).join(','))));
await dump('DIALOG'); await p.screenshot({path:'../ev/A-newwo-dialog.png'});
fs.writeFileSync('/tmp/sv12048/newwo-lane.txt',id+' '+d+' '+HR);
if(STAGE==='fill'){ const n=s.writes.length;
 const pick=async(sel,txt)=>{ await p.locator(`[data-test-id="${sel}"]`).click(); await p.waitForTimeout(800); if(txt) await p.keyboard.type(txt,{delay:40}); await p.waitForTimeout(2500); const o=p.locator('.q-menu .q-item').filter({hasText:txt||''}).first(); console.log('OPT',sel,await o.count(), await o.count()?(await o.innerText()).replace(/\s+/g,' ').slice(0,120):''); await o.click(); await p.waitForTimeout(1500); };
 await pick('select_customer_select',process.env.CUST); await pick('select_company_vehicle_select',''); await dump('FILLED'); await p.screenshot({path:'../ev/A-newwo-filled.png'});
 await p.locator('[data-test-id="button_save_work_order"]').click(); await p.waitForTimeout(5000);
 console.log('URL',p.url()); console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,400)))); await dump('AFTER'); await p.screenshot({path:'../ev/A-newwo-after.png'}); }
await s.close(); process.exit(0);
