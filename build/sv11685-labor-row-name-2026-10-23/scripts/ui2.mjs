import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const OUT='/tmp/qa11685/w/ui1026/'; const wo='f94beef2-ce77-4ec3-8d23-be8fb787348f';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1300},dpr:2});
const p=s.page; const reqs=[]; p.on('request',r=>{if(/settings\/change/.test(r.url())) reqs.push(r.method()+' '+(r.postData()||'').slice(0,250));});
await s.go(`/workorders/${wo}/finance`); await p.waitForTimeout(7000);
const state=async()=>p.evaluate(()=>{const T=e=>e?e.innerText.replace(/\s+/g,' ').trim():''; const roots=[document,...[...document.querySelectorAll('iframe')].map(f=>{try{return f.contentDocument}catch(e){return null}}).filter(Boolean)];
 const jobs=[]; for(const d of roots) for(const j of d.querySelectorAll('.job')){ const secs=[...j.querySelectorAll('.chargesec')].map(c=>T(c.querySelector('.csec-head'))); const lab=[...j.querySelectorAll('.chargesec')].filter(c=>/labor/i.test(T(c.querySelector('.csec-head')))).flatMap(c=>[...c.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('td')].map(T).filter(Boolean).join('|'))); const r=j.getBoundingClientRect(); jobs.push({no:T(j.querySelector('.job-no')),secs,lab,box:[r.x,r.y+window.scrollY,r.width,r.height]}); } return jobs;});
const toggles=async()=>p.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-test-id^="toggle_setting_"]')].map(e=>[e.getAttribute('data-test-id').replace('toggle_setting_',''),e.getAttribute('aria-checked')])));
const openGear=async()=>{await p.click('[data-test-id="button_invoice_settings"]'); await p.waitForTimeout(1200);};
const closeGear=async()=>{await p.keyboard.press('Escape'); await p.waitForTimeout(2500);};
const set=async(want)=>{await openGear(); for(const [k,v] of Object.entries(want)){ const t=await toggles(); if((t[k]==='true')!==v){ await p.click(`[data-test-id="toggle_setting_${k}"]`); await p.waitForTimeout(1500);} } const after=await toggles(); await closeGear(); return after;};
const waitJobs=async()=>{for(let i=0;i<30;i++){const j=await state(); if(j.find(x=>x.no==='01')) return; await p.waitForTimeout(1000);}};
const snapJob=async(tag)=>{ await waitJobs(); const jobs=await state(); const j=jobs.find(x=>x.no==='01'); console.log(tag, 'job01', JSON.stringify({secs:j.secs,lab:j.lab}), '| all jobs labor:', jobs.map(x=>x.no+':'+(x.lab.length?x.lab.join(';'):'none')).join(' ')); 
 const b=j.box; await p.evaluate(y=>window.scrollTo(0,y-150), b[1]); await p.waitForTimeout(600); const jb=(await state()).find(x=>x.no==='01').box; 
 await p.screenshot({path:OUT+tag+'.png'}); fs.writeFileSync(OUT+tag+'.json',JSON.stringify({jobs:await state(),scrollY:await p.evaluate(()=>window.scrollY)})); };
let t; try{
await snapJob('A-start'); t=await set({laborRate:false,laborHours:false,laborCost:false}); await p.reload(); await snapJob('B-all-off');
for(const [k,tag] of [['laborRate','C-rate-on'],['laborHours','D-hours-on'],['laborCost','E-price-on']]){ const w={laborRate:false,laborHours:false,laborCost:false}; w[k]=true; t=await set(w); await p.reload(); await p.waitForTimeout(7000); await snapJob(tag); }
} finally { t=await set({laborRate:false,laborHours:true,laborCost:true}); console.log('restored toggles',JSON.stringify(t)); await p.reload(); await snapJob('F-restored'); }
console.log('requests',reqs.length,reqs[0]);
process.exit(0);
