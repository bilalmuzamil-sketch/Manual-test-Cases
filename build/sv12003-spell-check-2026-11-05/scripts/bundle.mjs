// searches the deployed JS for labels + spellcheck usage
import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2000);
const out=await s.page.evaluate(async(pats)=>{ const seen=new Set(); const res={}; const q=[...document.scripts].map(x=>x.src).filter(Boolean); const all=[];
  // load main + every chunk referenced via import() strings
  while(q.length&&all.length<600){ const u=q.shift(); if(seen.has(u)) continue; seen.add(u); try{ const t=await (await fetch(u)).text(); all.push([u,t]); for(const m of t.matchAll(/["'`]((?:\.\/|\/)?assets\/[\w.-]+\.js)["'`]/g)){ const v=new URL(m[1],u).href; if(!seen.has(v)) q.push(v); } }catch(e){} }
  for(const p of pats){ res[p]=[]; for(const [u,t] of all){ const re=new RegExp('.{0,140}'+p+'.{0,140}','g'); for(const m of (t.match(re)||[]).slice(0,3)) res[p].push(u.split('/').pop()+' :: '+m); } }
  res._count=all.length; return res; },['Edit Customer Notes','Edit Vehicle Notes','spellcheck','Tech Story']);
fs.writeFileSync('/tmp/sv12003/bundle-'+(process.env.ENV||'branch')+'.json',JSON.stringify(out,null,1)); console.log('chunks',out._count); for(const k of Object.keys(out)) if(k!=='_count') console.log(k, out[k].length);
await s.close(); process.exit(0);
