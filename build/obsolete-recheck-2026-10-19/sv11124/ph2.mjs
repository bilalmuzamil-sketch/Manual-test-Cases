import {session} from './rec.mjs'; import fs from 'fs';
const UID='ba74948b-5777-4f0c-90fb-2f60d9ce8107';
const out={}; const a=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=a.page;
const hdrs=[]; p.on('response',r=>{ if(r.url().includes('view-avatar/'+UID)) hdrs.push({st:r.status(),cc:r.headers()['cache-control'],etag:r.headers()['etag'],lm:r.headers()['last-modified'],fromCache:r.fromServiceWorker()}); });
const find=async(tag)=>{ const boxes=await p.evaluate(u=>[...document.querySelectorAll('img')].filter(i=>i.src.includes(u)).map(i=>{const r=i.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,src:i.src}}).filter(b=>b.w>0),UID);
  const shot=`/tmp/qa11310/ex23/${tag}.png`; await p.screenshot({path:shot}); out[tag]={boxes}; return boxes; };
out.mk=await a.marker();
const pages=[['schedule','/schedule'],['workorders','/workorders'],['staff','/administration/staff']];
for(const [n,u] of pages){ await a.go(u); await p.waitForTimeout(6000); await find('X-'+n+'-before'); }
fs.writeFileSync('/tmp/qa11310/ex23/ph2.json',JSON.stringify({...out,hdrs},null,1)); console.log(JSON.stringify({...out,hdrs}).slice(0,3000)); await a.close();
