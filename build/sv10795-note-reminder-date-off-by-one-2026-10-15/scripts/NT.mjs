// usage: node NT.mjs <tz> <cal|type> <offsetDays> <tag> [clockISO] [env=branch|prod] [woFile]
import {ob,op,J,post} from './lib.mjs'; import fs from 'fs';
const [tz,method,off,tag,clock,env='branch',woFile='WO1.json']=process.argv.slice(2);
const A=JSON.parse(fs.readFileSync(woFile)); const s=env==='prod'?await op({tz}):await ob({tz}); const p=s.page;
if(clock && clock!=='-'){ await p.clock.install({time:new Date(clock)}); }
await post(s,'/api/iam/change-location',A.loc||{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const W=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/\/api\/.*note/i.test(r.url())) W.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')+' :: '+(r.postData()||'').slice(0,400)); });
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/.*note/i.test(r.url())) W.push('  <- '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300)); });
await s.go('/workorders/'+A.work_order_id+'/notes'); await p.waitForTimeout(4000);
const now=await p.evaluate(()=>new Date().toString()); const tgt=await p.evaluate(o=>{const d=new Date(); d.setDate(d.getDate()+o); return {y:d.getFullYear(),m:d.getMonth()+1,d:d.getDate(),mon:d.toLocaleString('en-US',{month:'long'})};},+off);
const content=`ZZAUTOTEST ${tag} ${tz} ${method} +${off}`;
await p.locator('[data-test-id="button_new_note"]').click(); await p.waitForTimeout(2000);
await p.locator('[data-test-id="input_note_content"]').fill(content);
if(method==='today'){ await p.locator('[data-test-id="date_icon_reminder_date"]').click(); await p.waitForTimeout(1200); await p.locator('[data-test-id="date_today_button_reminder_date"]').click(); await p.waitForTimeout(1200); }
else if(method==='cal'){ await p.locator('[data-test-id="date_icon_reminder_date"]').click(); await p.waitForTimeout(1200);
  for(let i=0;i<14;i++){ const lab=await p.evaluate(()=>[...document.querySelectorAll('.q-date__navigation button')].map(b=>b.innerText.trim())); if(lab.includes(tgt.mon)&&lab.includes(String(tgt.y))) break;
    await p.locator('.q-date__navigation button').filter({hasText:'chevron_right'}).first().click(); await p.waitForTimeout(400); }
  await p.locator('.q-date__calendar-item--in button').filter({hasText:new RegExp('^'+tgt.d+'$')}).first().click(); await p.waitForTimeout(1200);
} else { const v=`${String(tgt.m).padStart(2,'0')}/${String(tgt.d).padStart(2,'0')}/${tgt.y}`; const i=p.locator('[data-test-id="date_input_reminder_date"]'); await i.click(); await i.fill(''); await p.keyboard.type(v,{delay:30}); await p.keyboard.press('Tab'); await p.waitForTimeout(800); }
const picked=await p.locator('[data-test-id="date_input_reminder_date"]').inputValue(); await p.screenshot({path:`ev/${tag}-1-picked.png`});
const pickBox=await s.box('date_input_reminder_date');
await p.locator('[data-test-id="button_save_note"]').click(); await p.waitForTimeout(3500);
const noteId=()=>{const m=W.join(' ').match(/"id":"([0-9a-f-]{36})"/); return m&&m[1];};
const G=[]; p.on('response',async r=>{ if(r.request().method()==='GET'&&/\/api\/.*note/i.test(r.url())) G.push({u:r.url().replace(/.*\/api/,'/api'),b:(await r.text().catch(()=>'')).slice(0,2500)}); });
const card=async()=>p.evaluate(id=>{const card=document.querySelector(`[data-test-id="note_card_${id}"]`); if(!card) return null;
  const dates=[...card.querySelectorAll('*')].filter(e=>(e.innerText||'').length<40&&/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}|\d{1,2}\/\d{1,2}\/\d{2,4}/.test(e.innerText||'')).map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim(),color:getComputedStyle(e).color,b:[r.x,r.y,r.width,r.height].map(Math.round)}}).sort((a,b)=>a.b[2]-b.b[2]).slice(0,1);
  const r=card.getBoundingClientRect(); return {text:card.innerText.replace(/\s+/g,' ').slice(0,200),dates,b:[r.x,r.y,r.width,r.height].map(Math.round)};},noteId());
const c1=await card(); await p.screenshot({path:`ev/${tag}-2-list.png`});
await p.reload(); await p.waitForTimeout(4500); const c2=await card(); await p.screenshot({path:`ev/${tag}-3-reload.png`});
const stored=G.map(g=>{const i=g.b.indexOf(noteId()); return i<0?null:g.u+' '+g.b.slice(Math.max(0,i-50),i+700);}).filter(Boolean).slice(-1)[0];
const out={stored,noteId:noteId(),tz,method,off,clock,env,now,tgt,content,picked,pickBox,writes:W,afterSave:c1,afterReload:c2};
fs.writeFileSync(`nt-${tag}.json`,JSON.stringify(out,null,1));
console.log(tag,'| browser now',now.slice(0,33),'| target',`${tgt.m}/${tgt.d}/${tgt.y}`,'| input shows',picked,'\n writes',J(W,700),'\n list',J(c1&&c1.dates.map(d=>[d.t,d.color]),300),'\n reload',J(c2&&c2.dates.map(d=>[d.t,d.color]),300),'\n stored',J(stored&&stored.match(/reminder[^,]*,?[^,]*/gi),300));
await s.close();
