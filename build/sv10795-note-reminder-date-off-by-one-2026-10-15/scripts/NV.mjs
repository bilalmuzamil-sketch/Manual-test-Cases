// usage: node NV.mjs <tz> <tag> [env] [woFile] -> every note card's shown reminder vs its stored date
import {ob,op,J,post} from './lib.mjs'; import fs from 'fs';
const [tz,tag,env='branch',woFile='WO1.json']=process.argv.slice(2);
const A=JSON.parse(fs.readFileSync(woFile)); const s=env==='prod'?await op({tz}):await ob({tz}); const p=s.page;
await post(s,'/api/iam/change-location',A.loc||{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const G=[]; p.on('response',async r=>{ if(r.request().method()==='GET'&&/\/api\/.*note/i.test(r.url())) G.push(await r.text().catch(()=>'')); });
await s.go('/workorders/'+A.work_order_id+'/notes'); await p.waitForTimeout(6000);
const stored={}; for(const g of G){ try{ const j=JSON.parse(g); const walk=o=>{ if(Array.isArray(o)) o.forEach(walk); else if(o&&typeof o==='object'){ if(o.id&&'reminderDate' in o) stored[o.id]={rd:o.reminderDate,c:(o.content||'').slice(0,60)}; Object.values(o).forEach(walk);} }; walk(j);}catch(e){} }
const cards=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="note_card_"]')].map(c=>{const id=c.getAttribute('data-test-id').slice(10); const d=[...c.querySelectorAll('*')].filter(e=>(e.innerText||'').length<40&&/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}/.test(e.innerText||'')).map(e=>[e.innerText.replace(/\s+/g,' ').replace(/^\S+ /,''),getComputedStyle(e).color,e.getBoundingClientRect().width]).sort((a,b)=>a[2]-b[2])[0]; return {id,shown:d&&d[0],color:d&&d[1]};}));
const mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let ok=0,bad=0; const rows=[];
for(const c of cards){ const st=stored[c.id]; if(!st||!st.rd) continue; const [y,m,d]=st.rd.split('-').map(Number); const exp=`${mon[m-1]} ${d}, ${y}`; const match=c.shown===exp; match?ok++:bad++; rows.push([st.c.replace('ZZAUTOTEST ',''),st.rd,c.shown,c.color,match?'OK':'MISMATCH']); }
console.log(tag,tz,'browser now',await p.evaluate(()=>new Date().toString().slice(0,33)),'| cards',cards.length,'with reminder',rows.length,'| match',ok,'mismatch',bad); rows.forEach(r=>console.log('  ',J(r,200)));
fs.writeFileSync(`nv-${tag}.json`,JSON.stringify(rows,null,1)); await p.screenshot({path:`ev/${tag}.png`,fullPage:true}); await s.close();
