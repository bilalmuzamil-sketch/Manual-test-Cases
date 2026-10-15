// usage: node NE.mjs <tz> <noteId> <newOffsetDays> <tag> [env] [woFile]  -> reopen note, read date, change to new date, save, read card
import {ob,op,J,post} from './lib.mjs'; import fs from 'fs';
const [tz,noteId,off,tag,env='branch',woFile='WO1.json']=process.argv.slice(2);
const A=JSON.parse(fs.readFileSync(woFile)); const s=env==='prod'?await op({tz}):await ob({tz}); const p=s.page;
await post(s,'/api/iam/change-location',A.loc||{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const W=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/\/api\/.*note/i.test(r.url())) W.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')+' :: '+(r.postData()||'').slice(0,300)); });
await s.go('/workorders/'+A.work_order_id+'/notes'); await p.waitForTimeout(4000);
const card=async()=>p.evaluate(id=>{const c=document.querySelector(`[data-test-id="note_card_${id}"]`); if(!c) return null; return [...c.querySelectorAll('*')].filter(e=>(e.innerText||'').length<40&&/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}/.test(e.innerText||'')).map(e=>[e.innerText.trim().replace(/\s+/g,' '),getComputedStyle(e).color,e.getBoundingClientRect().width]).sort((a,b)=>a[2]-b[2]).slice(0,1);},noteId);
console.log('card before',J(await card()));
const kebab=await p.evaluate(id=>{const c=document.querySelector(`[data-test-id="note_card_${id}"]`); return [...c.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'));},noteId); console.log('card tids',J(kebab,600));
const kb=kebab.find(t=>/menu|action|more|kebab/i.test(t)); if(!kb){ console.log('no menu'); await s.close(); process.exit(); }
await p.locator(`[data-test-id="note_card_${noteId}"] [data-test-id="${kb}"]`).click(); await p.waitForTimeout(1200);
const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.trim())); console.log('menu',J(items,500));
await p.locator('.q-menu .q-item').filter({hasText:/Edit/}).first().click(); await p.waitForTimeout(2000);
const v0=await p.locator('.q-dialog [data-test-id="date_input_reminder_date"]').inputValue(); console.log('edit dialog shows',v0); await p.screenshot({path:`ev/${tag}-1-edit-open.png`});
const tgt=await p.evaluate(o=>{const d=new Date(); d.setDate(d.getDate()+o); return {y:d.getFullYear(),m:d.getMonth()+1,d:d.getDate(),mon:d.toLocaleString('en-US',{month:'long'})};},+off);
await p.locator('.q-dialog [data-test-id="date_icon_reminder_date"]').click(); await p.waitForTimeout(1200);
for(let i=0;i<14;i++){ const lab=await p.evaluate(()=>[...document.querySelectorAll('.q-date__navigation button')].map(b=>b.innerText.trim())); if(lab.includes(tgt.mon)&&lab.includes(String(tgt.y))) break; await p.locator('.q-date__navigation button').filter({hasText:'chevron_right'}).first().click(); await p.waitForTimeout(400); }
await p.locator('.q-date__calendar-item--in button').filter({hasText:new RegExp('^'+tgt.d+'$')}).first().click(); await p.waitForTimeout(1000);
const v1=await p.locator('.q-dialog [data-test-id="date_input_reminder_date"]').inputValue(); console.log('changed to',v1,'target',`${tgt.m}/${tgt.d}/${tgt.y}`);
const save=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/save/.test(t))); await p.locator(`.q-dialog [data-test-id="${save[0]}"]`).click(); await p.waitForTimeout(3500);
console.log('writes',J(W,600)); console.log('card after',J(await card())); await p.screenshot({path:`ev/${tag}-2-after-edit.png`});
await p.reload(); await p.waitForTimeout(4000); console.log('card after reload',J(await card())); await s.close();
