import {session} from './rec.mjs'; import fs from 'fs';
const UID='ba74948b-5777-4f0c-90fb-2f60d9ce8107'; const out={};
const a=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=a.page; out.mk=await a.marker();
const hdrs=[]; p.on('response',r=>{ if(r.url().includes('view-avatar/'+UID)) hdrs.push({t:Date.now(),st:r.status(),cc:r.headers()['cache-control']}); });
const look=async tag=>{ const h=await p.evaluateHandle(u=>[...document.querySelectorAll('img')].find(i=>i.src.includes(u)),UID); const e=h.asElement(); if(!e){out[tag]='none';return;}
  await e.scrollIntoViewIfNeeded(); await p.waitForTimeout(1500); const b=await e.boundingBox(); out[tag]=b;
  const row=await p.evaluate(el=>{let n=el; for(let i=0;i<6&&n;i++) n=n.parentElement; return n?n.innerText.replace(/\s+/g,' ').slice(0,80):''},e); out[tag+'_row']=row;
  await p.screenshot({path:`/tmp/qa11310/ex23/${tag}.png`}); };
await a.go('/schedule'); await p.waitForTimeout(6000); await look('S1-admin-before');
// Tech uploads photo C in a separate browser
const t=await session({quick:'tech',vp:{width:1440,height:900},dpr:2}); const q=t.page;
await t.go('/profile'); await q.waitForTimeout(3500); const inp=await q.$('input[type=file]'); await inp.setInputFiles('/tmp/qa11310/ex23/photoC.png'); await q.waitForTimeout(5000);
await q.reload(); await q.waitForTimeout(5000); await q.screenshot({path:'/tmp/qa11310/ex23/S2-tech-uploaded-C.png'}); await t.close();
// Admin: same page, no reload first (still old), then reload
await p.waitForTimeout(2000); await look('S3-admin-noreload');
await p.reload(); await p.waitForTimeout(7000); await look('S4-admin-reloaded');
out.hdrs=hdrs; fs.writeFileSync('/tmp/qa11310/ex23/ph3.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out)); await a.close();
