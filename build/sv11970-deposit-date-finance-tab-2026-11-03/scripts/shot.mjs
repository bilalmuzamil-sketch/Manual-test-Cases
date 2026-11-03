// usage: env TZ LOCNAME  node shot.mjs <woId> <outPng>  -> Finance tab scrolled to the deposit line, with boxes of the deposit line + document date
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const [WOID,OUTP]=process.argv.slice(2); const rd=f=>fs.readFileSync('/tmp/sv11970/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'11970',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa51',vp:{width:1440,height:900},dpr:2,tz:process.env.TZ});
const p=s.page; const {setLoc}=await import('./loc.mjs'); await setLoc(s,process.env.LOCNAME);
await s.go(`/workorders/${WOID}/finance`); await p.waitForTimeout(7000);
for(let i=0;i<3;i++){ const x=p.locator('.q-dialog [data-test-id="button_close_dialog"]').first(); if(await x.count()){await x.click().catch(()=>{}); await p.waitForTimeout(700);} }
const find=re=>p.evaluate(src=>{const re=new RegExp(src); const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n; while(n=w.nextNode()){ if(re.test(n.textContent)){ const el=n.parentElement; return el; } } return null;},re.source);
await p.evaluate(()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n; while(n=w.nextNode()){ if(/\(Deposit\)/.test(n.textContent)){ n.parentElement.scrollIntoView({block:'center'}); return; } }}); await p.waitForTimeout(1500);
const box=src=>p.evaluate(src=>{const re=new RegExp(src); const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n; const out=[]; while(n=w.nextNode()){ if(re.test(n.textContent)){ const r=n.parentElement.getBoundingClientRect(); out.push({t:n.parentElement.innerText.replace(/\s+/g,' ').slice(0,80),b:[r.x,r.y,r.width,r.height]}); } } return out;},src);
const R={dep:await box('\\(Deposit\\)'),date:await box('(Estimate date|Invoice date|Invoice Date|Estimate Date)'),now:await p.evaluate(()=>new Date().toString()),marker:await s.marker()};
await p.screenshot({path:OUTP}); fs.writeFileSync(OUTP.replace('.png','.json'),JSON.stringify(R,null,1)); console.log(JSON.stringify(R));
await s.close(); process.exit(0);
