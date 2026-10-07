import {ob,j} from './lib.mjs'; import fs from 'fs';
const {id}=JSON.parse(fs.readFileSync('ps.json')); const s=await ob({dpr:2}); const p=s.page;
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(1800);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tr')].filter(r=>/401-10B|84-2005/.test(r.innerHTML)).map(r=>{const chips=[...r.querySelectorAll('.q-badge,.q-chip')].map(e=>{const g=e.getBoundingClientRect();return {t:e.innerText.trim(),g:[g.x,g.y,g.width,g.height].map(Math.round)};});const pn=(r.innerHTML.match(/401-10B|84-2005/)||[''])[0];const g=r.getBoundingClientRect();return {pn,chips,btn:[...r.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean),g:[g.x,g.y,g.width,g.height].map(Math.round)};}));
console.log(j(rows,1200)); const st=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText.trim()); console.log('status',st);
fs.writeFileSync('shots/PS1.json',JSON.stringify(rows)); await s.shot('PS1','shots'); await s.close();
