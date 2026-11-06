// SV-12003 retest: list every deployed chunk mentioning spellcheck, with nearby test-ids / labels (finds the completion wizard + completion-gate tech story boxes)
import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2000);
const out=await s.page.evaluate(async()=>{ const seen=new Set(); const q=[...document.scripts].map(x=>x.src).filter(Boolean); const all=[];
  while(q.length&&all.length<900){ const u=q.shift(); if(seen.has(u)) continue; seen.add(u); try{ const t=await (await fetch(u)).text(); all.push([u,t]); for(const m of t.matchAll(/["'`]((?:\.\/|\/)?(?:assets\/)?[\w.-]+\.js)["'`]/g)){ const v=new URL(m[1],u).href; if(!seen.has(v)) q.push(v); } }catch(e){} }
  const res=[]; for(const [u,t] of all){ const hits=[...t.matchAll(/spellcheck/gi)]; if(!hits.length) continue; res.push({u:u.split('/').pop(),n:hits.length,ctx:hits.slice(0,8).map(h=>t.slice(Math.max(0,h.index-160),h.index+60).replace(/\s+/g,' ')),tech:(t.match(/[Tt]ech [Ss]tory[^"]{0,40}/g)||[]).slice(0,10),ids:[...new Set((t.match(/data-test-id":"[^"]*(?:story|wizard|complet)[^"]*"/gi)||[]))].slice(0,30)}); }
  return {chunks:all.length,res}; });
fs.writeFileSync('/tmp/sv12003/findspell.json',JSON.stringify(out,null,1)); console.log('chunks',out.chunks); for(const r of out.res) console.log(r.u,r.n,JSON.stringify(r.tech),JSON.stringify(r.ids));
await s.close(); process.exit(0);
