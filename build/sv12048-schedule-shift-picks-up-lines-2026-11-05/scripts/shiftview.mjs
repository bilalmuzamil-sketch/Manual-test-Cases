// usage: node shiftview.mjs <tag> <shot> [dayOffset=1] -> Schedule Day view, clicks the WO's block(s), prints Shift details text
import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,SHOT,OFF]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess({dpr:Number(process.env.DPR||1)}); const p=s.page;
const d=new Date(Date.now()+Number(OFF||1)*86400000).toISOString().slice(0,10);
await s.go('/schedule'); await p.waitForTimeout(4500);
const vt=p.locator('[data-test-id="schedule_view_toggle"]').getByText('Day',{exact:true}); if(await vt.count()){ await vt.first().click(); await p.waitForTimeout(1500);} 
const mc=p.locator(`[data-test-id="button_mini_calendar_day_${d}"]`); if(await mc.count()){ await mc.first().click(); await p.waitForTimeout(3000);} 
const blocks=p.locator('.fc-event',{hasText:S.customerName}); const n=await blocks.count(); console.log('blocks',n);
if(!n){ const sample=await p.evaluate(()=>[...document.querySelectorAll('[class*=event],[data-test-id*=block]')].slice(0,5).map(e=>e.className+' '+e.getAttribute('data-test-id')+' '+e.innerText.slice(0,40))); console.log(sample); }
for(let i=0;i<n;i++){ await blocks.nth(i).click(); await p.waitForTimeout(2500);
 const t=await p.evaluate(()=>{ const c=[...document.querySelectorAll('.q-dialog,.q-drawer,.q-menu,[role=dialog]')].filter(e=>e.offsetParent||e.getClientRects().length); return c.map(e=>e.innerText.replace(/\n+/g,' | ')).join(' || ').slice(0,900); });
 console.log('DETAILS',i,t); console.log('IDS',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id],.q-drawer [data-test-id],.q-menu [data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,18)).join(' | '))); console.log('RECTS',i,JSON.stringify(await p.evaluate(()=>Object.fromEntries(['text_shift_detail_title','text_shift_detail_line_count','text_shift_detail_scope','table_shift_lines','text_shift_detail_technician','text_shift_detail_scheduled'].map(t=>{const e=[...document.querySelectorAll(`[data-test-id="${t}"]`)].find(x=>x.offsetParent); if(!e) return [t,null]; const r=e.getBoundingClientRect(); return [t,[Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)]];}))))); await p.screenshot({path:`../ev/${SHOT}-${i}.png`}); await p.keyboard.press('Escape'); await p.waitForTimeout(800); }
await s.close(); process.exit(0);
