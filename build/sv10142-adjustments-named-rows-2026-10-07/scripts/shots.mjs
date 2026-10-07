import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2}); const p=s.page; const geo={};
for(const L of process.argv.slice(2)){ const W=JSON.parse(fs.readFileSync(`wo-${L}.json`));
  await s.go(`/workorders/${W.wo}/finance`); await p.waitForTimeout(5000);
  await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
  const g=await p.evaluate(()=>{ const els=[...document.querySelectorAll('*')].filter(e=>e.children.length===0 && /^Adjustments$/.test((e.textContent||'').trim()));
     const h=els[0]; if(!h) return null; h.scrollIntoView({block:'center'}); return true; });
  await p.waitForTimeout(800);
  const rows=await p.evaluate(()=>{ const h=[...document.querySelectorAll('*')].find(e=>e.children.length===0 && /^Adjustments$/.test((e.textContent||'').trim())); const hr=h.getBoundingClientRect();
     const leaves=[...document.querySelectorAll('*')].filter(e=>e.children.length===0 && (e.textContent||'').trim() && e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect(); return {t:e.textContent.trim(),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};});
     return {head:{x:Math.round(hr.x),y:Math.round(hr.y),w:Math.round(hr.width),h:Math.round(hr.height)}, near:leaves.filter(l=>l.y>=hr.y-4 && l.y<hr.y+520 && Math.abs(l.x-hr.x)<500)}; });
  const tabs=await p.evaluate(()=>[...document.querySelectorAll('[role=tab], .q-tab')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').trim().replace(/\n/g,' '),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};}));
  geo[L]={rows,tabs,url:p.url(),number:W.number}; await p.screenshot({path:`raw/screen-${L}.png`});
  console.log(L,W.number,j(rows.head),rows.near.map(r=>r.t+'@'+r.x+','+r.y).join(' ; ').slice(0,700)); }
fs.writeFileSync('raw/geo.json',JSON.stringify(geo,null,1)); await s.close();
