import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa95'}); await s.go('/workorders'); await s.page.waitForTimeout(2000);
const out=await s.page.evaluate(async()=>{ const seen=new Set(); const q=[...document.scripts].map(x=>x.src).filter(Boolean); const all=[];
  while(q.length&&all.length<900){ const u=q.shift(); if(seen.has(u)) continue; seen.add(u); try{ const t=await (await fetch(u)).text(); all.push([u,t]); for(const m of t.matchAll(/["'`]((?:\.\/|\/)?(?:assets\/)?[\w.-]+\.js)["'`]/g)){ const v=new URL(m[1],u).href; if(!seen.has(v)) q.push(v); } }catch(e){} }
  const r=[]; for(const [u,t] of all){ let i=t.indexOf('TechStoryGateModal'); while(i>=0){ r.push(u.split('/').pop()+' :: '+t.slice(Math.max(0,i-400),i+300).replace(/\s+/g,' ')); i=t.indexOf('TechStoryGateModal',i+1); if(r.length>12) break; } }
  const g=all.find(([u])=>u.includes('TechStoryGateModal')); return {r,gate:g?g[1].slice(0,4000):null}; });
fs.writeFileSync('/tmp/sv12003/findgate.json',JSON.stringify(out,null,1)); for(const x of out.r) console.log(x.slice(0,900)); console.log('GATE',(out.gate||'').replace(/\s+/g,' ').slice(0,2500));
await s.close(); process.exit(0);
